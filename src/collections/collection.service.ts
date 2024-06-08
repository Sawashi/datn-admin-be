import { Injectable } from '@nestjs/common';
import { Collection } from './collection.entity';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from '../dish/dish.entity';
import { CollectionWithDishFlagDto } from './dto/collectionWithDishFlag.dto';
@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionsRepository: Repository<Collection>,
    @InjectRepository(Dish)
    private dishesRepository: Repository<Dish>,
  ) {
    collectionsRepository: collectionsRepository;
    dishesRepository: dishesRepository;
  }

  // get all Collections
  async findAll(): Promise<Collection[]> {
    return await this.collectionsRepository.find({
      relations: {
        user: true,
        dishes: true,
      },
    });
  }

  // get one Collection
  async findOne(id: number): Promise<Collection> {
    return await this.collectionsRepository.findOne({ where: { id } });
  }

  // get collections by userId
  async findByUserId(userId: number): Promise<Collection[]> {
    return await this.collectionsRepository.find({
      where: { user: { id: userId } },
      relations: {
        user: true,
        dishes: true,
      },
    });
  }

  async findByDishId(dishId: number): Promise<Collection[]> {
    return await this.collectionsRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.dishes', 'dish')
      .where('dish.id = :dishId', { dishId })
      .getMany();
  }
  //  check if a dish is in the user's collection
  async isDishInCollection(userId: number, dishId: number): Promise<boolean> {
    const userCollection = await this.collectionsRepository.findOne({
      where: { user: { id: userId }, dishes: { id: dishId } },
    });
    return !!userCollection;
  }
  async isCollectionNameExists(
    userId: number,
    collectionName: string,
  ): Promise<boolean> {
    const collection = await this.collectionsRepository.findOne({
      where: { userId, collectionName },
    });
    return !!collection;
  }

  async create(
    userId: number,
    collectionName: string,
    collectionDcrpt: string,
  ): Promise<Collection> {
    const exists = await this.isCollectionNameExists(userId, collectionName);
    if (exists) {
      throw new Error('Collection already exists.');
    }
    const newCollection = this.collectionsRepository.create({
      userId,
      collectionName,
      collectionDcrpt,
    });
    return await this.collectionsRepository.save(newCollection);
  }

  // update Collection
  async update(id: number, collection: Collection): Promise<Collection> {
    await this.collectionsRepository.update(id, collection);
    return await this.collectionsRepository.findOne({ where: { id } });
  }

  // delete Collection
  async delete(id: number): Promise<void> {
    await this.collectionsRepository.delete(id);
  }

  async addDishToCollections(
    userId: number,
    dishId: number,
    collectionIds: number[],
  ): Promise<void> {
    const dish = await this.dishesRepository.findOne({ where: { id: dishId } });
    if (!dish) {
      throw new Error('Dish not found');
    }

    const collections = await this.collectionsRepository.find({
      where: { id: In(collectionIds), userId },
      relations: ['dishes'],
    });

    for (const collection of collections) {
      if (!collection.dishes.some((d) => d.id === dish.id)) {
        collection.dishes.push(dish);
        await this.collectionsRepository.save(collection);
      }
    }
  }

  async addDishByCollectionName(
    userId: number,
    dishId: number,
    collectionName: string,
  ): Promise<void> {
    // Check if the dish exists
    const dish = await this.dishesRepository.findOne({ where: { id: dishId } });
    if (!dish) {
      throw new Error('Dish not found');
    }

    // Check if the collection exists
    const allSavedDishsCollection = await this.collectionsRepository.findOne({
      where: { userId, collectionName: collectionName },
      relations: ['dishes'],
    });

    if (!allSavedDishsCollection) {
      throw new Error('Collection not found');
    }

    // Check if the dish is already in the collection
    if (allSavedDishsCollection.dishes.some((d) => d.id === dish.id)) {
      throw new Error('Dish already exists in the collection');
    }

    // Add the dish to the collection
    allSavedDishsCollection.dishes.push(dish);
    await this.collectionsRepository.save(allSavedDishsCollection);
  }

  async getCollectionsWithDishFlag(
    userId: number,
    dishId: number,
  ): Promise<CollectionWithDishFlagDto[]> {
    const collections = await this.collectionsRepository.find({
      where: { userId },
      relations: {
        dishes: true,
      },
    });

    return collections.map((collection) => ({
      id: collection.id,
      collectionName: collection.collectionName,
      hasDish: collection.dishes.some((dish) => dish.id === dishId),
    }));
  }

  async getDishesFromCollection(collectionId: number): Promise<Dish[]> {
    const collection = await this.collectionsRepository.findOne({
      where: { id: collectionId },
      relations: ['dishes'],
    });

    return collection.dishes;
  }

  // delete Collection
  async removeDishFromCollection(
    collectionId: number,
    dishId: number,
  ): Promise<void> {
    const collection = await this.collectionsRepository.findOne({
      where: { id: collectionId },
      relations: ['dishes'],
    });
    if (!collection) return;
    collection.dishes = collection.dishes.filter((dish) => {
      return dish.id != dishId;
    });
    await this.collectionsRepository.save(collection);
  }
  async updateDishCollections(
    userId: number,
    dishId: number,
    collectionIds: number[],
  ): Promise<void> {
    const collections = await this.findByUserId(userId);
    const dish = await this.collectionsRepository.manager.findOne(Dish, {
      where: { id: dishId },
      relations: ['collections'],
    });

    if (!dish) {
      throw new Error('Dish not found');
    }

    // Add the dish to new collections
    const collectionsToAdd = collections.filter((collection) =>
      collectionIds.includes(collection.id),
    );
    collectionsToAdd.forEach((collection) => {
      if (!dish.collections.find((c) => c.id === collection.id)) {
        dish.collections.push(collection);
      }
    });

    // Remove the dish from unchecked collections
    dish.collections.filter(
      (collection) => !collectionIds.includes(collection.id),
    );
    dish.collections = dish.collections.filter((collection) =>
      collectionIds.includes(collection.id),
    );

    await this.collectionsRepository.manager.save(dish);
  }
}
