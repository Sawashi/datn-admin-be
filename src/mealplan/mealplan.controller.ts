import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MealplanService } from './mealplan.service';

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
}
