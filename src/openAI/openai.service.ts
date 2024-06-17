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
      max_tokens: 800,
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
    //   'Question: Read the queryName and dishList below, find the dish in dishList related to the queryName:\n';
    // const note =
    //   'Note: Must analyze the ingredient of the dish in queryName to find the dish in dishList, example: queryName "Phở bò" mustn\'t return "Phở gà", queryName "bún" can return "bún bò" and "bún gà"\n';
    // const queryName = 'Name: ' + name + '\n';
    // const queryList = 'dishList: ' + JSON.stringify(dishList) + '\n';
    // const suffix =
    //   "Format of the answer (if don't have result just return empty array):";
    // const format = '[{ "id": <id of the dish> }]';
    //     Lọc ra cho tôi các tên món ăn trong danh sách bên dưới giống trên 50% với tên món ăn cần tìm:
    // - Tên món ăn cần tìm: "bún riêu cua miền tây"
    // - Danh sách: [{"id": 1, "dishName": "phở bò nam định"}, {"id": 2, "dishName": "bún bò"}, {"id": 3, "dishName": "bún riêu cua đồng"}, {"id": 4, "dishName": "phở gà"}, {"id": 5, "dishName": "apple pie british"}]
    // - In ra cho tôi format json '[{ "id": <id of the dish> }]'
    // Nếu không có kết quả phù hợp thì trả về []. Tôi chỉ cần json và không cần các thông tin khác.
    const prefix =
      'Lọc ra cho tôi các tên món ăn trong danh sách bên dưới giống trên 50% với tên món ăn cần tìm:\n';
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
}
