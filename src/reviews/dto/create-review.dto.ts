import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDTO {
  @IsNumber()
  @IsNotEmpty()
  dishId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  content: string;
}
