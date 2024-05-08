import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdatePersonalizeDto {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  allergies?: number[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  diets?: number[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  cuisines?: number[];
}
