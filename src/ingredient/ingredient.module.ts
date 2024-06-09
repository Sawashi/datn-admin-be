import { Module } from '@nestjs/common';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';
import { Ingredient } from './ingredient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DislikedIngredients } from 'src/disliked-ingredient/disliked-ingredient.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Ingredient, DislikedIngredients])],
  controllers: [IngredientController],
  providers: [IngredientService],
})
export class IngredientModule {}
