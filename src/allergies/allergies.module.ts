import { Module } from '@nestjs/common';
import { AllergiesService } from './allergies.service';
import { AllergiesController } from './allergies.controller';
import { Allergies } from './allergies.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Allergies])],
  providers: [AllergiesService],
  controllers: [AllergiesController],
})
export class AllergiesModule {}
