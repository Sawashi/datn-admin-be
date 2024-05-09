import { Module } from '@nestjs/common';
import { DietsService } from './diets.service';
import { DietsController } from './diets.controller';
import { Diets } from './diets.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Diets])],
  providers: [DietsService],
  controllers: [DietsController],
})
export class DietsModule {}
