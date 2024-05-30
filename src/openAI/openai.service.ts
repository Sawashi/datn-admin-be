import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OpenaiService {
  private readonly apiKey: string = process.env.OPENAI_KEY;

  constructor(private readonly httpService: HttpService) {
    httpService: httpService;
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
      max_tokens: 300,
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
}
