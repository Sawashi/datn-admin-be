import { ApiProperty } from '@nestjs/swagger';
import { Allergies } from 'src/allergies/allergies.entity';
import { Cuisine } from 'src/cuisines/cuisine.entity';
import { Diets } from 'src/diets/diets.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';

import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToOne,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';

@Entity('Personalize')
export class Personalize {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @OneToOne(() => User, (user) => user.personalize)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Cuisine, (cuisine) => cuisine.personalize)
  @JoinTable()
  cuisines: Cuisine[];

  @ManyToMany(() => Allergies, (allergies) => allergies.personalize)
  @JoinTable()
  allergies: Allergies[];

  @ManyToMany(() => Diets, (diets) => diets.personalize)
  @JoinTable()
  diets: Diets[];

  @ManyToMany(() => Ingredient, (ingredients) => ingredients.personalize)
  @JoinTable()
  ingredients: Ingredient[];

  @ApiProperty()
  dislike: boolean;
  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  //
}
