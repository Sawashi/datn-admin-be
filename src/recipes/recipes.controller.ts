import { RecipesService } from './recipes.service';
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query
  } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Recipe } from './recipe.entity';

  @ApiTags('recipes')
  @Controller('recipes')
  export class RecipesController {
    constructor(private readonly recipesService: RecipesService) {
      recipesService: recipesService;
    }
  
    //get all users
    @Get()
    async findAll(): Promise<Recipe[]> {
      return await this.recipesService.findAll();
    }

    @ApiOperation({
      summary: 'Get recipe',
      description: 'Get recipe by id',
    })
    //get one recipe
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Recipe> {
      const recipe = await this.recipesService.findOne(id);
      if (!recipe) {
        throw new Error('Recipe not found');
      } else {
        return recipe;
      }
    }

    //get recipes by Search
    @Get('search')
    async search(@Query('cuisineId') cuisineId?: number, @Query('categoryId') categoryId?: number,@Query('name') name?: string,@Query('chef') chef?: string,): Promise<Recipe[]> {
        const searchQuery={
            cuisineId,
            categoryId,
            name, 
            chef
          }
            return await this.recipesService.search(searchQuery);
        }

        
        
    //create recipe
    @Post()
    async create(@Body() recipe: Recipe): Promise<Recipe> {
      return await this.recipesService.create(recipe);
    }
  
    //update recipe
    @Put(':id')
    async update(@Param('id') id: number, @Body() recipe: Recipe): Promise<Recipe> {
      return this.recipesService.update(id, recipe);
    }
  
    //delete recipe
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
      //handle the error if user not found
      const user = await this.recipesService.findOne(id);
      if (!user) {
        throw new Error('User not found');
      }
      return this.recipesService.delete(id);
    }
  }
  