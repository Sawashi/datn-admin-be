import { Injectable } from '@nestjs/common';
import { Collection } from './collection.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collectionsRepository: Repository<Collection>,
  ) {
    collectionsRepository: collectionsRepository;
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

  //create Collection
  async create(collection: Collection): Promise<Collection> {
    console.log(collection);
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
}
