import { Injectable } from '@nestjs/common';
import { Cuisine } from './cuisine.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CuisinesService {
  constructor(
    @InjectRepository(Cuisine)
    private cuisinesRepository: Repository<Cuisine>,
  ) {
    cuisinesRepository: cuisinesRepository;
  }

  // get all cuisines
  async findAll(): Promise<Cuisine[]> {
    return await this.cuisinesRepository.find();
  }

  // get one cuisine
  async findOne(id: number): Promise<Cuisine> {
    return await this.cuisinesRepository.findOne({ where: { id } });
  }

  //create cuisine
  async create(cuisine: Cuisine): Promise<Cuisine> {
    const newCuisine = this.cuisinesRepository.create(cuisine);
    return await this.cuisinesRepository.save(newCuisine);
  }

  // update cuisine
  async update(id: number, cuisine: Cuisine): Promise<Cuisine> {
    await this.cuisinesRepository.update(id, cuisine);
    return await this.cuisinesRepository.findOne({ where: { id } });
  }

  // delete cuisine
  async delete(id: number): Promise<void> {
    await this.cuisinesRepository.delete(id);
  }
}
