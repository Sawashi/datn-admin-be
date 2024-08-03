import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReportReviewDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  reviewId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason: string;
}
