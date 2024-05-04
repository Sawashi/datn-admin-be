import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Dish')
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column({ nullable: true })
  cookingTime: string;
  @ApiProperty()
  @Column({ nullable: true })
  dishName: string;
  @ApiProperty()
  @Column({ nullable: true })
  imageUrl: string;
  @ApiProperty()
  @Column({ nullable: true })
  rating: number;
}
