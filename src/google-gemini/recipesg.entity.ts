import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity('recipeGenerated')
export class RecipeGenerated {
  @ApiProperty()
  @Column()
  ingredients: string;
  @ApiProperty()
  @Column()
  recipeDetails: string;
  @ApiProperty()
  @Column()
  note: string;
}
