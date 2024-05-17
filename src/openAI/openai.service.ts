import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class OpenaiService {
  private readonly apiKey: string = process.env.OPENAI_KEY; // Thay thế bằng API key của bạn

  constructor(private readonly httpService: HttpService) {
    httpService: httpService;
  }

  async callOpenAI(prompt: string): Promise<string> {
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
    const data = {
      model: 'gpt-3.5-turbo-0125', // Sử dụng mô hình gpt-3.5-turbo
      messages: [{ role: 'user', content: prompt }], // Định dạng mới của API chat
      max_tokens: 200,
    };

    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(url, data, { headers }),
      );
      return response.data.choices[0].message.content; // Trả về đoạn văn bản do OpenAI tạo ra
    } catch (error) {
      throw new HttpException(
        'Error calling OpenAI API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}