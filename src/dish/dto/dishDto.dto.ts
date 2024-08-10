import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDishIngredientDto } from './createDishIngreDto.dto';
export class DishDto {
  @ApiProperty()
  //@IsNumber()
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

  @ApiProperty({ type: [CreateDishIngredientDto] })
  //@IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateDishIngredientDto)
  ingredients: CreateDishIngredientDto[];

  @ApiProperty()
  //@IsNumber()
  @IsOptional()
  cuisines?: number;

  @ApiProperty()
  @IsOptional()
  diets?: number[];

  @ApiProperty()
  @IsOptional()
  courses?: number[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  youtubeId?: string;
}
