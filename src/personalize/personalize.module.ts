import { Module } from '@nestjs/common';
import { PersonalizeService } from './personalize.service';
import { PersonalizeController } from './personalize.controller';
import { Personalize } from './personalize.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diets } from 'src/diets/diets.entity';
import { Cuisine } from 'src/cuisines/cuisine.entity';
import { Allergies } from 'src/allergies/allergies.entity';
import { DislikedIngredients } from 'src/disliked-ingredient/disliked-ingredient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Personalize,
      Diets,
      Cuisine,
      Allergies,
      DislikedIngredients,
    ]),
  ],
  providers: [PersonalizeService],
  controllers: [PersonalizeController],
})
export class PersonalizeModule {}
