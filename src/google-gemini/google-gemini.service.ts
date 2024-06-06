import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/dish/dish.entity';
import { Repository } from 'typeorm';
import { FilteredResult } from './filtered.entity';
import { RecipeGenerated } from './recipesg.entity';
@Injectable()
class SimplifiedFilterResult {
  id: number;
}
class SimplifiedGuessImage {
  name: string;
  ingredients: string;
}
export class GoogleGeminiService {
  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
  ) {
    dishRepository: dishRepository;
  }
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  // Access your API key as an environment variable
  async runGemini(msg: string) {
    // For dialog language tasks (like chat), use the gemini-pro model
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const chat = model.startChat();

    const result = await chat.sendMessage(msg);
    const response = result.response;
    const text = response.text();
    console.log(text);
    return text;
  }
  async find(name: string): Promise<FilteredResult> {
    const dishes = await this.dishRepository.find({
      relations: {
        reviews: true,
        notes: true,
        collections: true,
        dishToIngredients: {
          ingredient: true,
        },
      },
    });
    //make array contain only id and name of dishes
    const dishList = dishes.map((dish) => {
      return { id: dish.id, dishName: dish.dishName };
    });
    const prefix =
      'Question: Read the queryName and dishList below, find the dish in dishList relate to the queryName:\n';
    const note =
      'Note: Must analyze the ingredent of the dish in queryName to find the dish in dishList, example: queryName "Phở bò" mustnt return "Phở gà", queryName "bún" can return "bún bò" and "bún gà"\n';
    const queryName = 'Name: ' + name + '\n';
    const queryList = 'dishList: ' + JSON.stringify(dishList) + '\n';
    const suffix =
      'Format of the answer (if dont have result just return empty array):';
    const format = '[id: <id of the dish>]';
    const query = prefix + note + queryName + queryList + suffix + format;
    let attempt = 0;
    const MAX_RETRIES = 5;
    while (attempt < MAX_RETRIES) {
      try {
        const response = await this.runGemini(query);
        const parsedResponse: Array<SimplifiedFilterResult> =
          JSON.parse(response);
        if (
          !Array.isArray(parsedResponse) ||
          !parsedResponse.every(
            (item) =>
              typeof item.id === 'number' && Object.keys(item).length === 1,
          )
        ) {
          throw new Error('Validation failed');
        }
        const resultDishes = dishes.filter((dish) =>
          parsedResponse.some((pr) => dish.id === pr.id),
        );
        if (resultDishes.length > 0) {
          return {
            existedInDatabase: true,
            dishList: resultDishes,
          };
        }
        return { existedInDatabase: false, dishList: [] };
      } catch (error) {
        attempt++;
        console.error(`Failed to parse response on attempt ${attempt}:`, error);

        if (attempt >= MAX_RETRIES) {
          return { existedInDatabase: false, dishList: [] };
        }
      }
    }
    return { existedInDatabase: false, dishList: [] };
  }
  //api generate recipe from ingredients and name of the dish
  async createRecipes(
    name: string,
    ingredients: string,
  ): Promise<RecipeGenerated> {
    const prefix =
      'Question: Read the ingredients and name below, generate the recipe relate to the ingredients and name:\n';
    const note = 'Note: Must analyze the ingredients to generate the recipe\n';
    const queryName = 'Name: ' + name + '\n';
    const queryIngredients = 'Ingredients: ' + ingredients + '\n';
    const suffix = 'Format of the answer:';
    const format =
      '{"ingredients": "<ingredient>", "recipeDetails": "<recipeDetails>", "note": "<note>"}';
    const query =
      prefix + note + queryName + queryIngredients + suffix + format;
    let attempt = 0;
    const MAX_RETRIES = 5;
    while (attempt < MAX_RETRIES) {
      try {
        const response = await this.runGemini(query);
        const parsedResponse: RecipeGenerated = JSON.parse(response);
        if (
          typeof parsedResponse.ingredients !== 'string' ||
          typeof parsedResponse.recipeDetails !== 'string' ||
          (parsedResponse.note !== null &&
            typeof parsedResponse.note !== 'string')
        ) {
          throw new Error('Validation failed');
        }
        return parsedResponse;
      } catch (error) {
        attempt++;
        console.error(`Failed to parse response on attempt ${attempt}:`, error);

        if (attempt >= MAX_RETRIES) {
          return { ingredients: '', recipeDetails: '', note: '' };
        }
      }
    }
    return { ingredients: '', recipeDetails: '', note: '' };
  }
  //api translate text to a different language
  async translate(text: string, language: string): Promise<string> {
    const prefix = 'Question: Translate the text below to the language:\n';
    const queryText = 'Text: ' + text + '\n';
    const queryLanguage = 'Language: ' + language + '\n';
    const suffix = 'Format of the answer:';
    const format = '<translated text>';
    const query = prefix + queryText + queryLanguage + suffix + format;
    let attempt = 0;
    const MAX_RETRIES = 5;
    while (attempt < MAX_RETRIES) {
      try {
        const response = await this.runGemini(query);
        return response;
      } catch (error) {
        attempt++;
        console.error(`Failed to parse response on attempt ${attempt}:`, error);

        if (attempt >= MAX_RETRIES) {
          return '';
        }
      }
    }
    return '';
  }

  // API generateRecipeFromImage
  async generateRecipeFromImage(
    image: Express.Multer.File,
  ): Promise<RecipeGenerated> {
    const prefix =
      'Question: Read the image below, guess the name and ingredient of that dish :\n';
    const suffix =
      'Format of the answer:\n{"name": "<name of the dish>", "ingredients": "<ingredients>"}\n' +
      'Note: "Don\'t use an array for ingredients, just use a string with commas to separate the ingredients. ' +
      'Make sure both name and ingredients are enclosed in double quotes if they contain spaces, e.g., "beef, chicken, pork".';
    // Convert the image to base64
    console.log('image', image);
    const base64Image = image.buffer.toString('base64');

    const queryImage = `Image: ${base64Image}\n`;
    const query = `${prefix}${queryImage}${suffix}`;

    const MAX_RETRIES = 5;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await this.runGemini(query);
        const parsedResponse: SimplifiedGuessImage = JSON.parse(response);
        // Validate the parsed response
        if (
          typeof parsedResponse.ingredients !== 'string' ||
          typeof parsedResponse.name !== 'string'
        ) {
          throw new Error('Validation failed');
        }
        const result: RecipeGenerated = await this.createRecipes(
          parsedResponse.name,
          parsedResponse.ingredients,
        );
        return result;
      } catch (error) {
        console.error(
          `Failed to parse response on attempt ${attempt + 1}:`,
          error,
        );

        if (attempt >= MAX_RETRIES - 1) {
          return { ingredients: '', recipeDetails: '', note: '' };
        }
      }
    }

    return { ingredients: '', recipeDetails: '', note: '' };
  }
}
