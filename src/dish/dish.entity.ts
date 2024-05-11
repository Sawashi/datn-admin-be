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
} from 'typeorm';
import { Ingredient } from '../ingredient/ingredient.entity';
import { Note } from 'src/notes/notes.entity';
import { Review } from 'src/reviews/review.entity';
import { Collection } from 'src/collections/collection.entity';
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
  @Column({ nullable: true })
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

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.dishes)
  @JoinTable({
    name: 'dish_ingredient',
    joinColumn: {
      name: 'dish_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'dish_ingredient_dish_id',
    },
    inverseJoinColumn: {
      name: 'ingredient_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'dish_ingredient_ingredient_id',
    },
  })
  ingredients: Ingredient[];

  @ManyToMany(() => Collection, (collection) => collection.dishes)
  collections: Collection[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
