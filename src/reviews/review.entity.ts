import { Dish } from 'src/dish/dish.entity';
import { User } from 'src/users/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ReportReview } from 'src/report-reviews/entities/report-review.entity';

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
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
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

  @OneToMany(() => ReportReview, (report) => report.review)
  reportReviews: ReportReview[];
}
