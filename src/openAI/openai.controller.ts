import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
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

  @Get('photos')
  async getRandomImage(@Query('query') query: string) {
    try {
      const imageLink = await this.openaiService.searchImages(query);
      return { imageUrl: imageLink };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('videos')
  async getLinkVideo(@Query('query') query: string) {
    try {
      const imageLink = await this.openaiService.searchVideo(query);
      return imageLink;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('recipe-image')
  async getRecipeImage(@Query('query') query: string) {
    try {
      const recipe = await this.openaiService.getRecipeWithImage(query);
      return recipe;
    } catch (error) {
      return error;
    }
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
