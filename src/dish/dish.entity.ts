import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Note } from 'src/notes/notes.entity';
import { Review } from 'src/reviews/review.entity';
import { Collection } from 'src/collections/collection.entity';
import { Cuisine } from 'src/cuisines/cuisine.entity';
import { Diets } from 'src/diets/diets.entity';
import { DishIngredient } from './dish_ingredient.entity';
import { MealPlan } from 'src/mealplan/mealplan.entity';
import { MealplanDish } from './dish_mealplan.entity';
import { Report } from 'src/reports/report.entity';
@Entity('Dish')
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column({ nullable: true })
  cookingTime: string;
  @ApiProperty()
  @Column({ nullable: true })
  dishName: string;
  @ApiProperty()
  @Column({ nullable: true })
  imageUrl: string;
  @ApiProperty()
  @Column({ type: 'float', default: 0, nullable: true })
  rating: number;
  @ApiProperty()
  @Column({ nullable: true })
  servings: number;
  @ApiProperty()
  @Column({ nullable: true })
  calories: number;
  @ApiProperty()
  @Column({ nullable: true })
  author: string;
  @ApiProperty()
  @Column({ nullable: true })
  directions: string;
  @OneToMany(() => Note, (note) => note.dish)
  notes: Note[];
  @OneToMany(() => Review, (review) => review.dish)
  reviews: Review[];

  @ManyToMany(() => Collection, (collection) => collection.dishes)
  collections: Collection[];

  @OneToMany(
    () => DishIngredient,
    (dishIngredient: DishIngredient) => dishIngredient.dish,
  )
  dishToIngredients: Array<DishIngredient>;

  @ManyToOne(() => Cuisine, (cuisine) => cuisine.dishes)
  @JoinColumn()
  cuisines: Cuisine;

  @OneToMany(() => MealplanDish, (mealplanDish) => mealplanDish.dish)
  mealplanDishes: MealplanDish[];

  @ManyToMany(() => Diets, (diet) => diet.dishes)
  @JoinTable()
  diets: Diets[];

  @ManyToMany(() => MealPlan, (mealPlan) => mealPlan.dishes)
  mealPlans: MealPlan[];

  @OneToMany(() => Report, (report) => report.dish)
  report: Report[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
