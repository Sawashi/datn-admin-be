import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './ingredient.entity';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {
    ingredientRepository: ingredientRepository;
  }
  // get all ingredient
  async findall(): Promise<Ingredient[]> {
    return await this.ingredientRepository.find({
      relations: {
        dishes: true,
      },
    });
  }

  // get one ingredient
  async findOne(id: number): Promise<Ingredient> {
    return await this.ingredientRepository.findOne({ where: { id } });
  }

  //create ingredient
  async create(ingredient: Ingredient): Promise<Ingredient> {
    const newIngredient = this.ingredientRepository.create(ingredient);
    return await this.ingredientRepository.save(newIngredient);
  }

  // update ingredient
  async update(id: number, ingredient: Ingredient): Promise<Ingredient> {
    await this.ingredientRepository.update(id, ingredient);
    return await this.ingredientRepository.findOne({ where: { id } });
  }

  // delete ingredient
  async delete(id: number): Promise<void> {
    await this.ingredientRepository.delete(id);
  }
}
