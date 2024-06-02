import { IsInt } from 'class-validator';

export class AddDishToMealPlanDto {
  @IsInt()
  mealPlanId: number;

  @IsInt()
  dishId: number;

  planDate: Date;
}

export class UpdateDishToMealPlanDto {
  @IsInt()
  mealPlanId: number;

  @IsInt()
  dishId: number;

  planDate: Date;
}
