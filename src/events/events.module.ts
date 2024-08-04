import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Dish } from 'src/dish/dish.entity';
import { User } from 'src/users/user.entity';
import { Collection } from 'src/collections/collection.entity';
import { DishIngredient } from 'src/dish/dish_ingredient.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { DishService } from 'src/dish/dish.service';
import { Personalize } from 'src/personalize/personalize.entity';
import { Note } from 'src/notes/notes.entity';
import { Review } from 'src/reviews/review.entity';
import { Cuisine } from 'src/cuisines/cuisine.entity';
import { Diets } from 'src/diets/diets.entity';
import { Courses } from 'src/course/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      User,
      Collection,
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
  controllers: [EventsController],
  providers: [EventsService, CloudinaryService, DishService],
  exports: [EventsService],
})
export class EventsModule {}
