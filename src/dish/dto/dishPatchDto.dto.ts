import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class DishPatchDto {
  @ApiProperty()
  @IsOptional()
  cookingTime: string;

  @ApiProperty()
  @IsOptional()
  dishName: string;

  @ApiProperty()
  @IsOptional()
  imageUrl: string;

  @ApiProperty()
  @IsOptional()
  rating: number;

  @ApiProperty()
  @IsOptional()
  servings: number;

  @ApiProperty()
  @IsOptional()
  calories: number;

  @ApiProperty()
  @IsOptional()
  author: string;

  @ApiProperty()
  @IsOptional()
  directions: string;

  @ApiProperty()
  @IsOptional()
  ingredients: string;

  @ApiProperty()
  @IsOptional()
  collections: string;

  @ApiProperty()
  @IsOptional()
  cuisines: number;
}
