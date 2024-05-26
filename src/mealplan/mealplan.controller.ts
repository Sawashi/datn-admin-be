import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MealplanService } from './mealplan.service';
import { AddDishToMealPlanDto } from 'src/dish/dto/disMealplanDto';

@ApiTags('mealplan')
@Controller('mealplan')
export class MealplanController {
  constructor(private readonly mealPlanService: MealplanService) {
    this.mealPlanService = mealPlanService;
  }

  @Get(':userId/dishes')
  async getDishesWithPlanDateByUserId(@Param('userId') userId: number) {
    return await this.mealPlanService.getDishesWithPlanDateByUserId(userId);
  }
  @Post()
  async addDishtoMealPlan(@Body() addDishToMealPlanDto: AddDishToMealPlanDto) {
    const { mealPlanId, dishId, planDate } = addDishToMealPlanDto;

    return await this.mealPlanService.addDishToMealPlan(
      mealPlanId,
      dishId,
      new Date(planDate),
    );
  }

  @Delete()
  async deleteDishFromMealPlan(@Body('dishId') dishId: number) {
    return await this.mealPlanService.deleteDishFromMealPlan(dishId);
  }
}
