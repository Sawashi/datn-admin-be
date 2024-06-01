import { Body, Controller, Post } from '@nestjs/common';
import { GoogleGeminiService } from './google-gemini.service';
import { FilteredResult } from './filtered.entity'; // Ensure the class name is correctly imported
import { ApiProperty, ApiTags } from '@nestjs/swagger';

// DTO for the request body
class FindDto {
  @ApiProperty()
  name: string;
}

@ApiTags('Google Gemini')
@Controller('google-gemini')
export class GoogleGeminiController {
  constructor(private readonly googleGeminiService: GoogleGeminiService) {
    this.googleGeminiService = googleGeminiService;
  }

  // Find recipes in database
  @Post('find-in-database')
  async find(@Body() findDto: FindDto): Promise<FilteredResult> {
    const { name } = findDto;
    return this.googleGeminiService.find(name);
  }
}
