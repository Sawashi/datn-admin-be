import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from './review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishService } from 'src/dish/dish.service';
import { Dish } from 'src/dish/dish.entity';
import { Note } from 'src/notes/notes.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { Collection } from 'src/collections/collection.entity';
import { Cuisine } from 'src/cuisines/cuisine.entity';
import { Diets } from 'src/diets/diets.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      Dish,
      Note,
      Ingredient,
      Collection,
      Cuisine,
      Diets,
    ]),
  ],
  providers: [ReviewsService, DishService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
