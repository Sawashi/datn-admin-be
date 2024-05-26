import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
export class DishDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dishName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  cookingTime?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  servings?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  calories?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  directions?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  ingredients?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  cuisines?: number;
}
