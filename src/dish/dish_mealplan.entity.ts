import { MealPlan } from 'src/mealplan/mealplan.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Dish } from './dish.entity';

@Entity('MealplanDish')
export class MealplanDish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mealPlanId: number;
  @ManyToOne(() => MealPlan, (mealPlan) => mealPlan.mealplanDishes)
  mealPlan: MealPlan;

  @ManyToOne(() => Dish, (dish) => dish.mealplanDishes)
  dish: Dish;

  @Column()
  dishId: number;

  @Column({ nullable: true })
  planDate: Date;
}
