import { Injectable } from '@nestjs/common';
import { Collection } from './collection.entity';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from '../dish/dish.entity';
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

  async create(collection: Collection): Promise<Collection> {
    const exists = await this.isCollectionNameExists(
      collection.userId,
      collection.collectionName,
    );
    if (exists) {
      throw new Error('Collection already exists.');
    }
    const newCollection = this.collectionsRepository.create(collection);
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
}
