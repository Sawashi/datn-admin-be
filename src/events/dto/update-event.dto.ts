import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional } from 'class-validator';

export class UpdateEventDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  eventName?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  startTime?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endTime?: Date;

  @ApiProperty({ type: [Number], required: false })
  @IsOptional()
  dishes?: number[]; // Chỉ định IDs của món ăn liên quan

  @ApiProperty()
  @IsOptional()
  @IsString()
  reward?: string;

  @ApiProperty()
  @IsOptional()
  description?: string;
}
