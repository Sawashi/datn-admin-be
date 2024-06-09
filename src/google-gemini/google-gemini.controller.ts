import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GoogleGeminiService } from './google-gemini.service';
import { FilteredResult } from './filtered.entity'; // Ensure the class name is correctly imported
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { RecipeGenerated } from './recipesg.entity';
import { FileInterceptor } from '@nestjs/platform-express';

// DTO for the request body
class FindDto {
  @ApiProperty()
  name: string;
}
class makeRecipesDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  ingredients: string;
}
class translateTextDto {
  @ApiProperty()
  text: string;
  @ApiProperty()
  language: string;
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

  // Create recipes from ingredients
  @Post('create-recipes')
  async createRecipes(
    @Body() createRecipeDto: makeRecipesDto,
  ): Promise<RecipeGenerated> {
    return this.googleGeminiService.createRecipes(
      createRecipeDto.name,
      createRecipeDto.ingredients,
    );
  }

  //Translate text to a different language
  @Post('translate')
  async translate(@Body() dataIn: translateTextDto): Promise<string> {
    return this.googleGeminiService.translate(dataIn.text, dataIn.language);
  }
  //API "generate recipe from image" input is image then return the generated recipe (RecipeGenerated)
  @Post('generate-recipe-from-image')
  @ApiOperation({ summary: 'Generate recipe from image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file',
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async generateRecipeFromImage(
    @UploadedFile() image: Express.Multer.File,
  ): Promise<RecipeGenerated> {
    return this.googleGeminiService.generateRecipeFromImage(image);
  }
}
