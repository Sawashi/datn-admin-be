import { Module } from '@nestjs/common';
import { CuisinesService } from './cuisines.service';
import { CuisinesController } from './cuisines.controller';
import { Cuisine } from './cuisine.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Cuisine])],
  providers: [CuisinesService],
  controllers: [CuisinesController],
})
export class CuisinesModule {}
