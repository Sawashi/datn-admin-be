import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MealplanService } from './mealplan.service';
import {
  AddDishToMealPlanDto,
  UpdateDishToMealPlanDto,
} from 'src/dish/dto/disMealplanDto';
import { DeleteDishFromMealPlanDto } from './dto/deleteDishMealPlanDto';

@ApiTags('mealplan')
@Controller('mealplan')
export class MealplanController {
  constructor(private readonly mealPlanService: MealplanService) {
    this.mealPlanService = mealPlanService;
  }

  @Get(':userId')
  async getDishesWithPlanDateByUserId(
    @Param('userId') userId: number,
    @Query('weekOffset') weekOffset: string,
  ) {
    const weekOffsetNumber = parseInt(weekOffset, 10) || 0;
    return await this.mealPlanService.getDishesWithPlanDateByUserId(
      userId,
      weekOffsetNumber,
    );
  }

  @Get(':userId/today')
  async getDishesWithPlanDateByUserIdForToday(
    @Param('userId') userId: number,
    @Query('dayOffset') dayOffset: string,
  ) {
    const dayOffsetNumber = parseInt(dayOffset, 10) || 0;
    return await this.mealPlanService.getDishesWithPlanDateByUserIdForToday(
      userId,
      dayOffsetNumber,
    );
  }
  @Post()
  async addDishtoMealPlan(@Body() addDishToMealPlanDto: AddDishToMealPlanDto) {
    const { mealPlanId, dishId } = addDishToMealPlanDto;

    return await this.mealPlanService.addDishToMealPlan(mealPlanId, dishId);
  }

  @Patch('update-plan-date')
  async updatePlanDate(@Body() updatePlanDateDto: UpdateDishToMealPlanDto) {
    const { mealPlanId, dishId, planDate } = updatePlanDateDto;
    return await this.mealPlanService.updatePlanDate(
      mealPlanId,
      dishId,
      new Date(planDate),
    );
  }

  @Delete()
  async deleteDishFromMealPlan(
    @Body() deleteDishMealPlanDto: DeleteDishFromMealPlanDto,
  ) {
    const { dishId, mealPlanId } = deleteDishMealPlanDto;

    return await this.mealPlanService.deleteDishFromMealPlan(
      dishId,
      mealPlanId,
    );
  }
}
