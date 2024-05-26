import { IsInt } from 'class-validator';

export class DeleteDishFromMealPlanDto {
  @IsInt()
  mealPlanId: number;

  @IsInt()
  dishId: number;
}
