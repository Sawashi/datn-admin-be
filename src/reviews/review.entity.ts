import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  dishId: number;
  @Column()
  userId: number;
  @Column()
  content: string;
  @Column()
  postedDate: string;
}
