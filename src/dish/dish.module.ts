import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { Dish } from './dish.entity';
import { DishIngredient } from './dish_ingredient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Note } from 'src/notes/notes.entity';
import { Review } from 'src/reviews/review.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { Collection } from 'src/collections/collection.entity';
import { Cuisine } from 'src/cuisines/cuisine.entity';
import { Diets } from 'src/diets/diets.entity';
import { Personalize } from 'src/personalize/personalize.entity';
import { Courses } from 'src/course/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Dish,
      DishIngredient,
      Personalize,
      Note,
      Review,
      Ingredient,
      Collection,
      Cuisine,
      Diets,
      Courses,
    ]),
  ],
  controllers: [DishController],
  providers: [DishService, CloudinaryService],
  exports: [DishService],
})
export class DishModule {}
