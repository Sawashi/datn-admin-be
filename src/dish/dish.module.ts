import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { Dish } from './dish.entity';
import { DishIngredient } from './dish_ingredient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Dish, DishIngredient])],
  controllers: [DishController],
  providers: [DishService],
})
export class DishModule {}
