import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class TopicUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  recordId: number;
}
