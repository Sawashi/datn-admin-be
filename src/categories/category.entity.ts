import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  categoryName: string;
  @Column()
  description: string;
}
