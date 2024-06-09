import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';

import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MealPlan } from 'src/mealplan/mealplan.entity';
import { MealplanDish } from 'src/dish/dish_mealplan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, MealPlan, MealplanDish])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
