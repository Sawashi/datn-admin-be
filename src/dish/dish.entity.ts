import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Dish')
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  cookingTime: string;
  @ApiProperty()
  @Column()
  dishName: string;
  @ApiProperty()
  @Column()
  imageUrl: string;
  @ApiProperty()
  @Column()
  rating: number;
}
