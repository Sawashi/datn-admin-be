import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn } from 'typeorm';

export class Dish {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  cookingTime: string;
  @ApiProperty()
  dishName: string;
  @ApiProperty()
  imageUrl: string;
  @ApiProperty()
  rating: number;
}
