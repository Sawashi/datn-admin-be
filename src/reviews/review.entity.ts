import { Dish } from 'src/dish/dish.entity';
import { User } from 'src/users/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('Review')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  content: string;

  @ApiProperty()
  @Column()
  rating: number;

  @ApiProperty()
  @Column()
  createdAt: Date;

  @ApiProperty()
  @Column({ nullable: true })
  updatedAt: Date;

  @ApiProperty()
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty()
  @Column({ name: 'dish_id' })
  dishId: number;

  @ManyToOne(() => Dish, (dish) => dish.reviews)
  @JoinColumn({ name: 'dish_id' })
  dish: Dish;
}
