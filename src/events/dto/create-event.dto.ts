// src/events/dto/create-event.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  eventName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @ApiProperty({ type: [Number], required: false })
  @IsOptional()
  dishes?: number[]; // Chỉ định IDs của món ăn liên quan

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reward: string;
}
