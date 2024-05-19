import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { Ingredient } from './ingredient.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';

@ApiTags('Ingredients')
@Controller('ingredient')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
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
