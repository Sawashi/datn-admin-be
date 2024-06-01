import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Collection } from 'src/collections/collection.entity';
import { Topic } from 'src/topics/topic.entity';
import { MealPlan } from 'src/mealplan/mealplan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Collection, Topic, MealPlan])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
