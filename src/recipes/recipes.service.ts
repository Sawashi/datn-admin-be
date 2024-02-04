import { Injectable } from '@nestjs/common';
import { Recipe } from './recipe.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
  ) {
    recipesRepository: recipesRepository;
  }
}
