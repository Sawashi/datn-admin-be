import { Module } from '@nestjs/common';
import { CuisinesService } from './cuisines.service';
import { CuisinesController } from './cuisines.controller';
import { Cuisine } from './cuisine.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from 'src/dish/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cuisine, Dish])],
  providers: [CuisinesService],
  controllers: [CuisinesController],
})
export class CuisinesModule {}
