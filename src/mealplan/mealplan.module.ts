import { Module } from '@nestjs/common';
import { MealplanController } from './mealplan.controller';
import { MealplanService } from './mealplan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealPlan } from './mealplan.entity';
import { User } from 'src/users/user.entity';
import { Dish } from 'src/dish/dish.entity';
import { MealplanDish } from 'src/dish/dish_mealplan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MealPlan, User, Dish, MealplanDish])],
  controllers: [MealplanController],
  providers: [MealplanService],
})
export class MealplanModule {}
