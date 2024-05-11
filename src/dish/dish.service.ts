import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from './dish.entity';
import { DishDto } from './dto/dishDto.dto';
import { Note } from 'src/notes/notes.entity';
import { Review } from 'src/reviews/review.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { Collection } from 'src/collections/collection.entity';
import { DishPatchDto } from './dto/dishPatchDto.dto';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
  ) {
    dishRepository: dishRepository;
    noteRepository: noteRepository;
    reviewRepository: reviewRepository;
    ingredientRepository: ingredientRepository;
    collectionRepository: collectionRepository;
  }
  // get all dish
  async findall(): Promise<Dish[]> {
    return await this.dishRepository.find({
      relations: {
        reviews: true,
        notes: true,
        ingredients: true,
        collections: true,
      },
    });
  }

  // get one dish
  async findOne(id: number): Promise<Dish> {
    return await this.dishRepository.findOne({
      where: { id },
      relations: {
        reviews: true,
        notes: true,
        ingredients: true,
        collections: true,
      },
    });
  }

  //create dish
  async create(dishDto: DishDto, imageUrl: string): Promise<Dish> {
    const newDish = this.dishRepository.create({
      cookingTime: dishDto.cookingTime,
      dishName: dishDto.dishName,
      imageUrl: imageUrl,
      servings: dishDto.servings,
      calories: dishDto.calories,
      author: dishDto.author,
      directions: dishDto.directions,
    });
    return await this.dishRepository.save(newDish);
  }

  // update dish
  async update(id: number, dishPatchDto: DishPatchDto): Promise<Dish> {
    const dish = await this.dishRepository.findOne({
      where: { id },
    });

    if (!dish) {
      throw new Error('Personalize not found');
    }
    const { ingredients, collections, ...otherProps } = dishPatchDto; // Destructure ingredients and collections

    if (ingredients) {
      const ingredientEntites = await this.ingredientRepository.findByIds(
        JSON.parse(ingredients),
      );
      if (ingredientEntites.length > 0) {
        dish.ingredients = ingredientEntites;
      }
    }
    if (collections) {
      const collectionEntites = await this.collectionRepository.findByIds(
        JSON.parse(collections),
      );
      if (collectionEntites.length > 0) {
        dish.collections = collectionEntites;
      }
    }

    Object.assign(dish, otherProps);
    return await this.dishRepository.save(dish);
  }

  // delete dish
  async delete(id: number): Promise<void> {
    await this.dishRepository.delete(id);
  }

  // compute rating
  async updateAverageRating(dishId: number): Promise<void> {
    const dish = await this.findOne(dishId);
    if (dish) {
      const reviews = dish.reviews;
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0,
      );
      const averageRating = totalRating / reviews.length;
      dish.rating = averageRating;
      await this.dishRepository.save(dish);
    }
  }
}
