import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { Ingredient } from './ingredient.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Ingredients')
@Controller('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {
    this.ingredientService = ingredientService;
  }
  //get all ingredient
  @Get()
  async findAll(): Promise<Ingredient[]> {
    return await this.ingredientService.findall();
  }
  //get one ingredient
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Ingredient> {
    const ingredient = await this.ingredientService.findOne(id);
    if (!ingredient) {
      throw new Error('Ingredient not found');
    } else {
      return ingredient;
    }
  }

  //create ingredient
  @Post()
  async create(@Body() ingredient: Ingredient): Promise<Ingredient> {
    return await this.ingredientService.create(ingredient);
  }

  //update ingredient
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() ingredient: Ingredient,
  ): Promise<Ingredient> {
    return this.ingredientService.update(id, ingredient);
  }

  //delete ingredient
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if ingredient not found
    const ingredient = await this.ingredientService.findOne(id);
    if (!ingredient) {
      throw new Error('Ingredient not found');
    }
    return this.ingredientService.delete(id);
  }
}
