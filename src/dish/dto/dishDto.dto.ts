import { ApiProperty } from '@nestjs/swagger';

export class DishDto {
  @ApiProperty()
  cookingTime: string;

  @ApiProperty()
  dishName: string;

  @ApiProperty()
  servings: number;

  @ApiProperty()
  calories: number;

  @ApiProperty()
  author: string;

  @ApiProperty()
  directions: string;
}
