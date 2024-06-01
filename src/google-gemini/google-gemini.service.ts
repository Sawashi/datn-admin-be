import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/dish/dish.entity';
import { Repository } from 'typeorm';
import { FilteredResult } from './filtered.entity';

@Injectable()
class SimplifiedFilterResult {
  id: number;
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
}
