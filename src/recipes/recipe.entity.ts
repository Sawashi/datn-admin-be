import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Recipe')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  dishId: number;
  @Column()
  chef: string;
  @Column()
  description: string;
}
