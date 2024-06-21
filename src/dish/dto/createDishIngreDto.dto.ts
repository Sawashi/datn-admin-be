import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateDishIngredientDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  ingredientId?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ingredientName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mass: string;
}
