import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

  @Get(':userId/dishes')
  async getDishesWithPlanDateByUserId(@Param('userId') userId: number) {
    return await this.mealPlanService.getDishesWithPlanDateByUserId(userId);
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
