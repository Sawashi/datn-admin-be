import { IsDateString, IsInt } from 'class-validator';

export class AddDishToMealPlanDto {
  @IsInt()
  mealPlanId: number;

  @IsInt()
  dishId: number;

  @IsDateString()
  planDate: string;
}
