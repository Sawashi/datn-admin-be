import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dish } from './dish.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';
@Entity({ name: 'dish_ingredient' })
export class DishIngredient {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column({ nullable: true })
  mass: string;

  @ManyToOne(() => Dish, (dish: Dish) => dish.dishToIngredients)
  @JoinColumn({ name: 'dish_id', referencedColumnName: 'id' })
  dish: Dish;

  @ManyToOne(
    () => Ingredient,
    (ingredient: Ingredient) => ingredient.dishToIngredients,
  )
  @JoinColumn({ name: 'ingredient_id', referencedColumnName: 'id' })
  ingredient: Ingredient;
}
