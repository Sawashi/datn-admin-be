import { Injectable } from '@nestjs/common';
import { Recipe } from './recipe.entity';
import { Repository, ILike } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
  ) {
    recipesRepository: recipesRepository;
  }

  // get all recipes
  async findAll(): Promise<Recipe[]> {
    return await this.recipesRepository.find();
  }

  // get one recipe
  async findOne(id: number): Promise<Recipe> {
    return await this.recipesRepository.findOne({ where: { id } });
  }

  // search recipes
  async search(searchQuery: {cuisineId: number, categoryId: number, name: string, chef: string}): Promise<Recipe[]> {
    var query = `SELECT * FROM Recipe WHERE 1 = 1`
    if(searchQuery.cuisineId){
      query += `AND cuisineId = ${searchQuery.cuisineId}`
    }
    if(searchQuery.categoryId){
      query += `AND cuisineId = ${searchQuery.categoryId}`
    }
    if(searchQuery.name){
      query += `AND cuisineId = '%${searchQuery.name}%'`
    }
    if(searchQuery.chef){
      query += `AND cuisineId = '%${searchQuery.chef}%'`
    }
    
    return await this.recipesRepository.query(query);
  }
  

  // // get by category
  // async findAllByCat(categoryId: number): Promise<Recipe[]> {
  //   return await this.recipesRepository.find({where: {categoryId}});
  // }

  // // get by cuisine
  // async findAllByCuisine(cuisineId: number): Promise<Recipe[]> {
  //   return await this.recipesRepository.find({where: {cuisineId}});
  // }

  // // get by chef
  // async findAllByChef(chef: string): Promise<Recipe[]> {
  //   return await this.recipesRepository.find({where: {chef}});
  // }

  // // get by name
  // async findAllByName(name: string): Promise<Recipe[]> {
  //   return await this.recipesRepository.findBy({name: ILike(`%${name}%`)});
  // }

  // // get by ingredient
  // async findAllByIngredient(ingredient: string): Promise<Recipe[]> {
  //   return await this.recipesRepository.findBy({ingredients: ILike(`%${ingredient}%`)});
  // }


  //create cuisine
  async create(recipe: Recipe): Promise<Recipe> {
    const newRecipe = this.recipesRepository.create(recipe);
    return await this.recipesRepository.save(newRecipe);
  }

  // update cuisine
  async update(id: number, recipe: Recipe): Promise<Recipe> {
    await this.recipesRepository.update(id, recipe);
    return await this.recipesRepository.findOne({ where: { id } });
  }

  // delete cuisine
  async delete(id: number): Promise<void> {
    await this.recipesRepository.delete(id);
  }
}
