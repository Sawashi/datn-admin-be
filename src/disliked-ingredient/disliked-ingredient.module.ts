import { Module } from '@nestjs/common';
import { DislikedIngredientController } from './disliked-ingredient.controller';
import { DislikedIngredientService } from './disliked-ingredient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DislikedIngredients } from './disliked-ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DislikedIngredients])],
  controllers: [DislikedIngredientController],
  providers: [DislikedIngredientService],
})
export class DislikedIngredientModule {}
