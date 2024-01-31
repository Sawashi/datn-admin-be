import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cuisine {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  cuisineName: string;
  @Column()
  description: string;
}
