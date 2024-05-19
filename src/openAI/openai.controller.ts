import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';

@Controller('openai')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {
    openaiService: openaiService;
  }

  @Post('generate')
  async generateText(@Body('prompt') prompt: string): Promise<string> {
    return this.openaiService.callOpenAI(prompt);
  }
}
