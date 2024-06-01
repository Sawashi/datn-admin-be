import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity('recipeGenerated')
export class RecipeGenerated {
  @ApiProperty()
  @Column()
  ingredient: string;
  @ApiProperty()
  @Column()
  recipeGenerated: string;
  @ApiProperty()
  @Column()
  note: string;
}
