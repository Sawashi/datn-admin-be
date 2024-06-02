import { Module } from '@nestjs/common';
import { GoogleGeminiController } from './google-gemini.controller';
import { GoogleGeminiService } from './google-gemini.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from 'src/dish/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dish])],
  controllers: [GoogleGeminiController],
  providers: [GoogleGeminiService],
})
export class GoogleGeminiModule {}
