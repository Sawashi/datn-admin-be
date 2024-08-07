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
import { Personalize } from 'src/personalize/personalize.entity';
import { DishIngredient } from 'src/dish/dish_ingredient.entity';
import { Courses } from 'src/course/course.entity';
import { ReportReview } from 'src/report-reviews/entities/report-review.entity';
import { ReportReviewsService } from 'src/report-reviews/report-reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Review,
      Dish,
      Note,
      Personalize,
      Ingredient,
      Collection,
      Cuisine,
      Diets,
      DishIngredient,
      Courses,
      ReportReview,
    ]),
  ],
  providers: [ReviewsService, DishService, ReportReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
