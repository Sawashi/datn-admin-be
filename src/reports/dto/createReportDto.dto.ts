import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
} from 'class-validator';

export class CreateReportDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsIn([0, 1, 2], { message: 'Status must be either 0, 1, or 2' })
  status: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  dishId: number;
}
