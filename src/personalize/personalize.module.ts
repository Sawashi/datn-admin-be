import { Module } from '@nestjs/common';
import { PersonalizeService } from './personalize.service';
import { PersonalizeController } from './personalize.controller';
import { Personalize } from './personalize.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diets } from 'src/diets/diets.entity';
import { Cuisine } from 'src/cuisines/cuisine.entity';
import { Allergies } from 'src/allergies/allergies.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Personalize,
      Diets,
      Cuisine,
      Allergies,
      Ingredient,
    ]),
  ],
  providers: [PersonalizeService],
  controllers: [PersonalizeController],
})
export class PersonalizeModule {}
