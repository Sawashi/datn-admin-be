import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsArray,
  IsNumber,
  IsString,
  IsIn,
  Min,
} from 'class-validator';

export class RecordCreateDto {
  @ApiProperty()
  @IsNumber()
  userId?: number;

  @ApiProperty()
  @IsString()
  nameRecord: string;

  @ApiProperty()
  @IsOptional()
  @IsIn([0, 1, 2], { message: 'Meal must be either 0, 1, or 2' })
  meal: number;

  @ApiProperty()
  @IsOptional()
  money: number;

  @ApiProperty()
  @Min(1, { message: 'Number of diners must be greater than or equal 1' })
  numberOfDiners: number;

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
