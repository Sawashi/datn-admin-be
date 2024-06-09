import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import { Dish } from 'src/dish/dish.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
@Entity('Report')
export class Report {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column()
  content: string;
  @ApiProperty()
  @Column({ default: 0 })
  status: number;

  @ApiProperty()
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty()
  @Column({ name: 'dish_id' })
  dishId: number;
  @ManyToOne(() => Dish, (dish) => dish.notes)
  @JoinColumn({ name: 'dish_id' })
  dish: Dish;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
