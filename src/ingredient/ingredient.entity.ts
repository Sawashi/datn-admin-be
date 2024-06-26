import { ApiProperty } from '@nestjs/swagger';
import { DishIngredient } from 'src/dish/dish_ingredient.entity';
import { DislikedIngredients } from 'src/disliked-ingredient/disliked-ingredient.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinTable,
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

  @ManyToMany(() => DislikedIngredients, (dislikeds) => dislikeds.ingredients)
  @JoinTable()
  dislikeds: DislikedIngredients[];
}
