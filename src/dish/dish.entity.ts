import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Dish {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column({ unique: true })
  cookingTime: string;
  @ApiProperty()
  @Column({ unique: true })
  dishName: string;
  @ApiProperty()
  @Column({ unique: true })
  imageUrl: string;
  @ApiProperty()
  @Column({ unique: true })
  rating: number;
}
