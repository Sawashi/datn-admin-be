import { IsInt, IsOptional } from 'class-validator';

export class DeleteDishFromMealPlanDto {
  @IsInt()
  dishId: number;

  @IsInt()
  mealPlanId: number;

  @IsOptional()
  planDate?: Date;
}
