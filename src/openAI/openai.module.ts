import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { Dish } from 'src/dish/dish.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Dish])],
  providers: [OpenaiService],
  controllers: [OpenaiController],
  exports: [OpenaiService],
})
export class OpenaiModule {}
