import { ApiProperty } from '@nestjs/swagger';
import { DishIngredient } from 'src/dish/dish_ingredient.entity';
import { Personalize } from 'src/personalize/personalize.entity';

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity('Ingredient')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column({ nullable: true })
  ingredientName: string;
  @ApiProperty()
  @Column({ nullable: true })
  imageUrl: string;
  @ApiProperty()
  @Column({ nullable: true })
  description: string;
  @OneToMany(
    () => DishIngredient,
    (dishIngredient: DishIngredient) => dishIngredient.dish,
  )
  dishToIngredients: Array<DishIngredient>;

  @ManyToMany(() => Personalize, (personalize) => personalize.ingredients)
  personalize: Personalize[];
}
