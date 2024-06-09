import { ApiProperty } from '@nestjs/swagger';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { Personalize } from 'src/personalize/personalize.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

@Entity('Disliked-Ingredients')
export class DislikedIngredients {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @ManyToMany(() => Ingredient, (ingredients) => ingredients.dislikeds)
  ingredients: Ingredient[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Personalize, (personalize) => personalize.diets)
  personalize: Personalize[];
}
