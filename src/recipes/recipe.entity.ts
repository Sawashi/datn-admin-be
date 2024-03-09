import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Recipe')
export class Recipe {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @ApiProperty()
  @Column()
  name: string;
  @ApiProperty()
  @Column()
  chef: string;
  @ApiProperty()
  @Column()
  imgUrl: string;
  @ApiProperty()
  @Column()
  ingredients: string;
  @ApiProperty()
  @Column()
  description: string;
  @ApiProperty()
  @Column()
  categoryId: Number
  @ApiProperty()
  @Column()
  cuisineId: Number
}
