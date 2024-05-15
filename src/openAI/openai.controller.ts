import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {
    openaiService: openaiService;
  }

  @Post('generate')
  async generateText(@Body('prompt') prompt: string): Promise<string> {
    return this.openaiService.callOpenAI(prompt);
  }
}
