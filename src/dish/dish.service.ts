import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Dish } from './dish.entity';
import { DishDto } from './dto/dishDto.dto';
import { Note } from 'src/notes/notes.entity';
import { Review } from 'src/reviews/review.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { Collection } from 'src/collections/collection.entity';
import { DishPatchDto } from './dto/dishPatchDto.dto';
import { Cuisine } from 'src/cuisines/cuisine.entity';
import { Diets } from 'src/diets/diets.entity';
import { DishIngredient } from './dish_ingredient.entity';
import { PaginationDto } from './dto/pagination.dto';
import { Personalize } from 'src/personalize/personalize.entity';

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
    @InjectRepository(Cuisine)
    private cuisineRepository: Repository<Cuisine>,
    @InjectRepository(Diets)
    private dietRepository: Repository<Diets>,
    @InjectRepository(Personalize)
    private personalizeRepository: Repository<Personalize>,
  ) {
    dishRepository: dishRepository;
    noteRepository: noteRepository;
    reviewRepository: reviewRepository;
    ingredientRepository: ingredientRepository;
    collectionRepository: collectionRepository;
    cuisineRepository: cuisineRepository;
    dietRepository: dietRepository;
    personalizeRepository: personalizeRepository;
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<{ data: Dish[]; count: number }> {
    const { page, limit } = paginationDto;
    const [data, count] = await this.dishRepository.findAndCount({
      relations: {
        reviews: true,
        notes: true,
        collections: true,
        dishToIngredients: {
          ingredient: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (data.length === 0 && page > 1) {
      return { data: [], count };
    }

    return { data, count };
  }

  // get one dish
  async findOne(id: number): Promise<Dish> {
    return await this.dishRepository.findOne({
      where: { id },
      relations: {
        reviews: true,
        notes: true,
        collections: true,
        dishToIngredients: {
          ingredient: true,
        },
      },
    });
  }

  async create(dishDto: DishDto, imageUrl: string): Promise<Dish> {
    const { ingredients, cuisines, diets } = dishDto;

    const newDish = this.dishRepository.create({
      cookingTime: dishDto.cookingTime,
      dishName: dishDto.dishName,
      imageUrl: imageUrl,
      servings: dishDto.servings,
      calories: dishDto.calories,
      author: dishDto.author,
      directions: dishDto.directions,
    });

    if (ingredients) {
      const ingredientEntities = await this.ingredientRepository.findByIds(
        JSON.parse(ingredients),
      );
      if (ingredientEntities.length === JSON.parse(ingredients).length) {
        const dishIngredients = ingredientEntities.map((ingredient) => {
          const dishIngredient = new DishIngredient();
          dishIngredient.ingredient = ingredient;
          dishIngredient.dish = newDish;
          return dishIngredient;
        });
        newDish.dishToIngredients = dishIngredients;
        console.log(dishIngredients);
      } else {
        throw new Error('Ingredients not found');
      }
    }

    if (cuisines) {
      const cuisineEntities = await this.cuisineRepository.findOne({
        where: { id: cuisines },
      });
      if (cuisineEntities) {
        newDish.cuisines = cuisineEntities;
      }
    }

    if (diets) {
      const dietEntities = await this.dietRepository.find({
        where: { id: In(diets) },
      });

      if (dietEntities) {
        newDish.diets = dietEntities;
      }
    }

    return await this.dishRepository.save(newDish);
  }

  async update(id: number, dishPatchDto: DishPatchDto): Promise<Dish> {
    const dish = await this.dishRepository.findOne({
      where: { id },
    });

    if (!dish) {
      throw new Error('Dish not found');
    }

    const { ingredients, collections, cuisines, diets, ...otherProps } =
      dishPatchDto; // Destructure ingredients and collections

    if (ingredients) {
      const ingredientEntities = await this.ingredientRepository.findByIds(
        JSON.parse(ingredients),
      );
      if (ingredientEntities.length === JSON.parse(ingredients).length) {
        const dishIngredients = ingredientEntities.map((ingredient) => {
          const dishIngredient = new DishIngredient();
          dishIngredient.ingredient = ingredient;
          dishIngredient.dish = dish;
          return dishIngredient;
        });
        dish.dishToIngredients = dishIngredients;
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
    if (diets) {
      const dietEntites = await this.dietRepository.findByIds(
        JSON.parse(diets),
      );
      if (dietEntites.length === JSON.parse(diets).length) {
        dish.diets = dietEntites;
      }
    }
    if (cuisines) {
      const cuisineEntities = await this.cuisineRepository.findOne({
        where: { id: cuisines },
      });
      if (cuisineEntities) {
        dish.cuisines = cuisineEntities;
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

  async findDishBySearchText(
    searchText?: string,
    sort: 'asc' | 'desc' = 'asc',
    cookingTime?: string,
    ingredientIds?: number[],
    cuisineIds?: number[],
    dietIds?: number[],
  ): Promise<Dish[]> {
    const parseIngredientIds = ingredientIds?.map((id) =>
      parseInt(id.toString()),
    );
    const parseCuisineIds = cuisineIds?.map((id) => parseInt(id.toString()));
    const parseDietsIds = dietIds?.map((id) => parseInt(id.toString()));

    const queryBuilder = this.dishRepository
      .createQueryBuilder('dish')
      .leftJoinAndSelect('dish.dishToIngredients', 'dish_ingredient')
      .leftJoinAndSelect('dish.diets', 'dish_diets_diets')
      .leftJoinAndSelect('dish.cuisines', 'cuisine')
      .where('dish.dishName like :searchText', {
        searchText: `%${searchText ?? ''}%`,
      });

    if (cookingTime) {
      queryBuilder.andWhere('dish.cookingTime <= :cookingTime', {
        cookingTime: parseInt(cookingTime),
      });
    }

    if (parseIngredientIds) {
      queryBuilder.andWhere(
        'dish_ingredient.ingredient_id IN (:...ingredientIds)',
        {
          ingredientIds: parseIngredientIds,
        },
      );
    }

    if (cuisineIds && cuisineIds.length > 0) {
      queryBuilder.andWhere('dish.cuisinesId IN (:...cuisineIds)', {
        cuisineIds: parseCuisineIds,
      });
    }

    if (parseDietsIds) {
      queryBuilder.andWhere('dish_diets_diets.id IN (:...dietIds)', {
        dietIds: parseDietsIds,
      });
    }

    if (sort) {
      queryBuilder.orderBy(
        'dish.createdAt',
        sort.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    return await queryBuilder.getMany();
  }

  async findByCreated(
    sort: 'asc' | 'desc' = 'asc',
    limit?: number, // Add the limit parameter
  ): Promise<Dish[]> {
    const queryBuilder = this.dishRepository.createQueryBuilder('dish');

    if (sort) {
      queryBuilder.orderBy(
        'dish.createdAt',
        sort.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    if (limit !== undefined) {
      queryBuilder.limit(limit); // Limit the number of results
    }

    return await queryBuilder.getMany();
  }

  async findRelatedDishes(id: number): Promise<Dish[]> {
    const dish = await this.dishRepository.findOne({
      where: { id },
    });
    if (!dish) {
      throw new NotFoundException('Dish not found');
    }
    const inputDishName = dish.dishName.toLowerCase();
    const inputKeywords = inputDishName.split(' ');

    const dishes = await this.dishRepository.find();
    const relatedDishes = dishes.filter((d) => {
      const dishName = d.dishName.toLowerCase();
      return (
        inputKeywords.some((keyword) => dishName.includes(keyword)) &&
        d.id !== dish.id
      );
    });

    return relatedDishes;
  }

  async recommendDishes(userId: number): Promise<Dish[]> {
    const queryBuilder = this.personalizeRepository
      .createQueryBuilder('personalize')
      .where('personalize.user_id = :userId', { userId })
      .leftJoinAndSelect('personalize.cuisines', 'cuisine')
      .leftJoinAndSelect('cuisine.dishes', 'dish')
      .leftJoinAndSelect('personalize.diets', 'diet')
      .leftJoinAndSelect('diet.dishes', 'dietDish');
    const response = await queryBuilder.getOne();

    const dishesCuisine = response.cuisines
      .map((cuisine) => cuisine.dishes)
      .flat();
    const dishesDiet = response.diets.map((diet) => diet.dishes).flat();

    const recommendedDishes = [...dishesCuisine, ...dishesDiet].reduce(
      (accumulator, currentDish) => {
        const existingDishIndex = accumulator.findIndex(
          (dish) => dish.id === currentDish.id,
        );

        if (existingDishIndex === -1) {
          accumulator.push(currentDish);
        }

        return accumulator;
      },
      [],
    );

    return recommendedDishes;
  }

  async getHealthyDishes(dietCount: number): Promise<Dish[]> {
    const queryBuilder = this.dishRepository
      .createQueryBuilder('dish')
      .leftJoin('dish.diets', 'diet')
      .groupBy('dish.id')
      .having('COUNT(diet.id) >= :dietCount', { dietCount: dietCount })
      .select('dish');

    const dishes = await queryBuilder.getMany();

    return dishes;
  }

  async getHealthyDishesV2(dietNames: string[] | string): Promise<Dish[]> {
    if (typeof dietNames === 'string') {
      dietNames = [dietNames];
    }

    const queryBuilder = this.dishRepository
      .createQueryBuilder('dish')
      .leftJoin('dish.diets', 'diet')
      .where('diet.name IN (:...dishNames)', {
        dishNames: dietNames,
      });

    const dishes = await queryBuilder.getMany();

    return dishes;
  }

  async getQuicklyDishes(ingredientCount: number): Promise<Dish[]> {
    const queryBuilder = this.dishRepository
      .createQueryBuilder('dish')
      .leftJoin('dish.dishToIngredients', 'ingredient')
      .groupBy('dish.id')
      .having('COUNT(ingredient.id) <= :ingredientCount', {
        ingredientCount: ingredientCount,
      })
      .select('dish');

    const dishes = await queryBuilder.getMany();

    return dishes;
  }

  // async findRelatedDishes(dto: GetRelatedDishesDto): Promise<OutputDishDto[]> {
  //   const dish = await this.dishRepository.findOne(dto.dishId);
  //   if (!dish) {
  //     throw new NotFoundException('Dish not found');
  //   }

  //   const inputDishName = dish.dishName.toLowerCase();
  //   const inputKeywords = inputDishName.split(' ');

  //   const dishes = await this.dishRepository.find();
  //   const relatedDishes = dishes.filter(d => {
  //     const dishName = d.dishName.toLowerCase();
  //     return inputKeywords.some(keyword => dishName.includes(keyword)) &&
  //            d.id !== dish.id;
  //   });

  //   return relatedDishes.map(d => ({
  //     id: d.id,
  //     dishName: d.dishName,
  //     imageUrl: d.imageUrl,
  //   }));
  // }
}
