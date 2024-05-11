import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsString()
  @IsOptional()
  content: string;

  @IsNumber()
  @IsOptional()
  rating: number;
}
