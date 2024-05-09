import { ApiProperty } from '@nestjs/swagger';
import { Dish } from 'src/dish/dish.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity('Ingredient')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column({ nullable: true })
  ingredientName: string;
  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Dish, (dish) => dish.ingredients)
  dishes: Dish[];
}
