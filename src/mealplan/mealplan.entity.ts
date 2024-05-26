import { ApiProperty } from '@nestjs/swagger';
import { Dish } from 'src/dish/dish.entity';
import { MealplanDish } from 'src/dish/dish_mealplan.entity';
import { User } from 'src/users/user.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('Mealplan')
export class MealPlan {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @ApiProperty()
  @Column()
  user_id: number;

  @OneToOne(() => User, (user) => user.mealPlan)
  @JoinColumn({ name: 'id' })
  user: User;

  @ManyToMany(() => Dish, (dish) => dish.mealPlans)
  dishes: Dish[];
  @OneToMany(() => MealplanDish, (mealplanDish) => mealplanDish.mealPlan)
  mealplanDishes: MealplanDish[];
}
