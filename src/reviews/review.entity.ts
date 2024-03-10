import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Review')
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
  rating: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
