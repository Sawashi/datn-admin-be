import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, ILike, In, Repository } from 'typeorm';
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
    @InjectRepository(DishIngredient)
    private readonly dishIngredientRepository: Repository<DishIngredient>,
  ) {
    dishRepository: dishRepository;
    noteRepository: noteRepository;
    reviewRepository: reviewRepository;
    ingredientRepository: ingredientRepository;
    collectionRepository: collectionRepository;
    cuisineRepository: cuisineRepository;
    dietRepository: dietRepository;
    personalizeRepository: personalizeRepository;
    dishIngredientRepository: dishIngredientRepository;
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
      where: {
        deletedAt: null,
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
      where: { id, deletedAt: null },
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
    const savedDish = await this.dishRepository.save(newDish);

    const ingredientPromises = ingredients.map(async (ingredientDto) => {
      const existingIngredient = await this.ingredientRepository.findOne({
        where: {
          ingredientName: ILike(ingredientDto.ingredientName),
        },
      });

      if (!existingIngredient) {
        const newIngredient = this.ingredientRepository.create({
          ingredientName: ingredientDto.ingredientName,
          imageUrl: ingredientDto.imageUrl,
          description: ingredientDto.description,
        });

        await this.ingredientRepository.save(newIngredient);

        return {
          ingredient: newIngredient,
          mass: ingredientDto.mass,
        };
      } else {
        return {
          ingredient: existingIngredient,
          mass: ingredientDto.mass,
        };
      }
    });

    const resolvedIngredients = await Promise.all(ingredientPromises);

    const dishIngredientPromises = resolvedIngredients.map(
      ({ ingredient, mass }) => {
        const dishIngredient = this.dishIngredientRepository.create({
          dish: savedDish,
          ingredient,
          mass,
        });

        return this.dishIngredientRepository.save(dishIngredient);
      },
    );

    await Promise.all(dishIngredientPromises);

    return this.dishRepository.findOne({
      where: { id: savedDish.id },
      relations: ['dishToIngredients', 'dishToIngredients.ingredient'],
    });
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
    await this.dishRepository.softDelete(id);
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
    ingredientIds?: string[] | string,
    cuisineIds?: string[] | string,
    dietIds?: string[] | string,
    ingredientNames?: string[] | string,
  ): Promise<Dish[]> {
    if (typeof ingredientIds === 'string') {
      ingredientIds = [ingredientIds];
    }

    if (typeof cuisineIds === 'string') {
      cuisineIds = [cuisineIds];
    }

    if (typeof dietIds === 'string') {
      dietIds = [dietIds];
    }

    if (typeof ingredientNames === 'string') {
      ingredientNames = [ingredientNames];
    }

    const queryBuilder = this.dishRepository
      .createQueryBuilder('dish')
      .leftJoinAndSelect('dish.dishToIngredients', 'dish_ingredient')
      .leftJoinAndSelect('dish_ingredient.ingredient', 'ingredient')
      .leftJoinAndSelect('dish.diets', 'dish_diets_diets')
      .leftJoinAndSelect('dish.cuisines', 'cuisine')
      .where('dish.deletedAt IS NULL');

    if (searchText) {
      queryBuilder.where('dish.dishName ilike :searchText', {
        searchText: `%${searchText}%`,
      });
    }

    if (cookingTime) {
      queryBuilder.andWhere('dish.cookingTime <= :cookingTime', {
        cookingTime: parseInt(cookingTime),
      });
    }

    if (ingredientIds && ingredientIds.length > 0) {
      queryBuilder.andWhere(
        'dish_ingredient.ingredient_id IN (:...ingredientIds)',
        {
          ingredientIds: ingredientIds,
        },
      );
    }

    if (cuisineIds && cuisineIds.length > 0) {
      queryBuilder.andWhere('dish.cuisinesId IN (:...cuisineIds)', {
        cuisineIds: cuisineIds,
      });
    }

    if (dietIds && dietIds.length > 0) {
      queryBuilder.andWhere('dish_diets_diets.id IN (:...dietIds)', {
        dietIds: dietIds,
      });
    }

    if (ingredientNames && ingredientNames.length > 0) {
      const ingredientConditions = ingredientNames
        .map((_name, index) => `ingredient.ingredientName ILIKE :name${index}`)
        .join(' OR ');

      const parameters = ingredientNames.reduce((acc, name, index) => {
        acc[`name${index}`] = `%${name}%`;
        return acc;
      }, {});

      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(ingredientConditions, parameters);
        }),
      );
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
    const queryBuilder = this.dishRepository
      .createQueryBuilder('dish')
      .where('dish.deletedAt IS NULL');

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
      where: { id, deletedAt: null },
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
      .leftJoinAndSelect('dish.dishToIngredients', 'dish_ingredient')
      .leftJoinAndSelect('dish_ingredient.ingredient', 'ingredient')
      .leftJoinAndSelect('personalize.diets', 'diet')
      .leftJoinAndSelect('diet.dishes', 'dietDish')
      .andWhere('dish.deletedAt IS NULL');

    const response = await queryBuilder.getOne();

    if (!response) {
      const dishes = await this.findAll({
        page: 1,
        limit: 5,
      });
      return dishes.data;
    }

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

    if (recommendedDishes.length === 0) {
      const dishes = await this.findAll({
        page: 1,
        limit: 5,
      });
      return dishes.data;
    }

    return recommendedDishes;
  }

  async getHealthyDishes(dietCount: number): Promise<Dish[]> {
    const queryBuilder = this.dishRepository
      .createQueryBuilder('dish')
      .leftJoinAndSelect('dish.dishToIngredients', 'dish_ingredient')
      .leftJoinAndSelect('dish_ingredient.ingredient', 'ingredient')
      .leftJoinAndSelect('dish.diets', 'diet')
      .where('dish.deletedAt IS NULL')
      .groupBy('dish.id')
      .addGroupBy('dish_ingredient.id')
      .addGroupBy('ingredient.id')
      .having('COUNT(diet.id) >= :dietCount', { dietCount: dietCount })
      .select(['dish', 'dish_ingredient', 'ingredient']);

    const dishes = await queryBuilder.getMany();

    if (dishes.length === 0) {
      const dishes = await this.findAll({
        page: 1,
        limit: 5,
      });
      return dishes.data;
    }

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

    if (dishes.length === 0) {
      const dishes = await this.findAll({
        page: 1,
        limit: 5,
      });
      return dishes.data;
    }

    return dishes;
  }

  async getQuicklyDishes(ingredientCount: number): Promise<Dish[]> {
    const queryBuilder = this.dishRepository
      .createQueryBuilder('dish')
      .leftJoinAndSelect('dish.dishToIngredients', 'dish_ingredient')
      .leftJoinAndSelect('dish_ingredient.ingredient', 'ingredient')
      .where('dish.deletedAt IS NULL')
      .groupBy('dish.id')
      .addGroupBy('dish_ingredient.id')
      .addGroupBy('ingredient.id')
      .having('COUNT(dish_ingredient.id) <= :ingredientCount', {
        ingredientCount: ingredientCount,
      })
      .select(['dish', 'dish_ingredient', 'ingredient']);

    const dishes = await queryBuilder.getMany();

    if (dishes.length === 0) {
      const dishes = await this.findAll({
        page: 1,
        limit: 5,
      });
      return dishes.data;
    }

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
