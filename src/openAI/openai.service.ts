import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { FilteredResult } from './filtered.entity';
import { Dish } from 'src/dish/dish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class OpenaiService {
  private readonly apiKey: string = process.env.OPENAI_KEY;
  private readonly googleKey: string = process.env.GOOGLE_API_KEY;
  private readonly customeSearchEngine: string =
    process.env.CUSTOM_SEARCH_ENGINE_ID;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
  ) {
    httpService: httpService;
    dishRepository: dishRepository;
  }

  async callOpenAI(prompt: string): Promise<string> {
    console.log(this.apiKey);
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
    const data = {
      model: 'gpt-3.5-turbo-0125',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
    };

    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(url, data, { headers }),
      );
      if (response.data) {
        console.log(response.data);
        const responseMessage = response.data.choices[0].message.content;
        console.log(responseMessage);
        return responseMessage;
      }
    } catch (error) {
      throw new HttpException(
        'Error calling OpenAI API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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

    // Make array contain only id and name of dishes
    const dishList = dishes.map((dish) => {
      return { id: dish.id, dishName: dish.dishName };
    });

    // const prefix =
    //   'Lọc ra cho tôi các tên món ăn trong danh sách bên dưới giống trên 80% với tên món ăn cần tìm. Ví dụ bún bò thì ra bún bò, bún bò huế, không được ra bún riêu, bún khác:\n';
    // const prefix =
    //   'Lọc ra cho tôi các món ăn trong danh sách bên dưới trùng khớp với món ăn cần tìm. Ví dụ bún bò thì ra bún bò, bún bò huế, không được ra bún riêu, bún khác. Có thể bỏ qua các dấu và không phân biệt chữ hoa chữ thường:\n';
    const prefix =
      'Lọc ra các món ăn trong danh sách bên dưới trùng khớp với món ăn cần tìm. Ví dụ: "bún bò" thì ra "bún bò", "bún bò Huế", không ra "bún riêu" hay "bún khác". Ví dụ khác: "bún chả cá" thì không ra "chả cá Lã Vọng". Bỏ qua dấu và không phân biệt chữ hoa chữ thường:\n';

    const queryName = '- Tên món ăn cần tìm: ' + name + '\n';
    const queryList = '- Danh sách: ' + JSON.stringify(dishList) + '\n';
    const suffix =
      'Nếu không có kết quả phù hợp thì trả về []. Tôi chỉ cần json và không cần các thông tin khác.';
    const format =
      '- In ra cho tôi format json \'[{ "id": <id of the dish> }]\'\n';
    const query = prefix + queryName + queryList + format + suffix;

    let attempt = 0;
    const MAX_RETRIES = 5;

    while (attempt < MAX_RETRIES) {
      try {
        const response = await this.callOpenAI(query);
        const parsedResponse: Array<{ id: number }> = JSON.parse(response);

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

  async searchImages(query: string): Promise<string> {
    const maxResults = 10;

    const randomStart = Math.floor(Math.random() * maxResults) + 1;

    const url = 'https://www.googleapis.com/customsearch/v1';
    const params = {
      q: query,
      cx: this.customeSearchEngine,
      key: this.googleKey,
      searchType: 'image',
      num: 1,
      start: randomStart,
      fileType: 'jpg|png',
    };

    try {
      const response: AxiosResponse<any> = await this.httpService.axiosRef.get(
        url,
        { params },
      );
      const items = response.data.items;
      if (items && items.length > 0) {
        const imageLink = items[0].link || items[0].thumbnailLink;
        return imageLink;
      } else {
        throw new Error('No images found');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async searchVideo(query: string): Promise<any> {
    const url = 'https://youtube.googleapis.com/youtube/v3/search';
    const params = {
      key: this.googleKey,
      q: query,
      part: 'snippet',
      type: 'video',
      maxResults: 3,
    };

    try {
      const response: AxiosResponse<any> = await this.httpService.axiosRef.get(
        url,
        { params },
      );
      return response.data.items.map((item) => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));
    } catch (error) {
      throw new Error(`Failed to search YouTube ${error.message}`);
    }
  }

  async getRecipeWithImage(query: string): Promise<{
    recipe: string;
    image: string;
    video: { title: string; url: string };
  }> {
    try {
      const recipePrompt = `Giới thiệu và cho tôi công thức nấu ăn của món ${query}`;
      const recipe = await this.callOpenAI(recipePrompt);

      const image = await this.searchImages(query);

      const video = await this.searchVideo(query);

      return {
        recipe: recipe,
        image: image,
        video: video,
      };
    } catch (error) {
      throw new Error(`Failed to get recipe with image: ${error.message}`);
    }
  }
}
