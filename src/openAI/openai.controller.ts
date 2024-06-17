import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { FilteredResult } from './filtered.entity';
class FindDto {
  @ApiProperty()
  name: string;
}

@Controller('openai')
@ApiBearerAuth('JWT')
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

  @Post('find-in-database')
  async find(@Body() findDto: FindDto): Promise<FilteredResult> {
    const { name } = findDto;
    return this.openaiService.find(name);
  }
}
