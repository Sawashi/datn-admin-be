import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class DishDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  cookingTime?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  dishName: string;

  @ApiProperty()
  //@IsNumber()
  @IsOptional()
  servings?: number;

  @ApiProperty()
  //@IsNumber()
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
  //@IsNumber()
  @IsOptional()
  cuisines?: number;

  @ApiProperty()
  @IsOptional()
  diets?: number[];
}
