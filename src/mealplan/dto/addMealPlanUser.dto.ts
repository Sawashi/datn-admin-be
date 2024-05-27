import { IsNumber } from 'class-validator';

export class AddMealPlanForUserDto {
  @IsNumber()
  userId: number;
}
