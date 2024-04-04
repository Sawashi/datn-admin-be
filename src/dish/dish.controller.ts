import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { Dish } from './dish.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('dish')
@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {
    this.dishService = dishService;
  }
  //get all dish
  @Get()
  async findAll(): Promise<Dish[]> {
    return await this.dishService.findall();
  }
  //get one dish
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Dish> {
    const dish = await this.dishService.findOne(id);
    if (!dish) {
      throw new Error('Dish not found');
    } else {
      return dish;
    }
  }

  //create dish
  @Post()
  async create(@Body() dish: Dish): Promise<Dish> {
    return await this.dishService.create(dish);
  }

  //update dish
  @Put(':id')
  async update(@Param('id') id: number, @Body() dish: Dish): Promise<Dish> {
    return this.dishService.update(id, dish);
  }

  //delete dish
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if dish not found
    const dish = await this.dishService.findOne(id);
    if (!dish) {
      throw new Error('Dish not found');
    }
    return this.dishService.delete(id);
  }
}
