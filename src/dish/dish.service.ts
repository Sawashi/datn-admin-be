import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from './dish.entity';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
  ) {
    dishRepository: dishRepository;
  }
  // get all dish
  async findall(): Promise<Dish[]> {
    return await this.dishRepository.find();
  }

  // get one user
  async findOne(id: number): Promise<Dish> {
    return await this.dishRepository.findOne({ where: { id } });
  }

  //create user
  async create(user: Dish): Promise<Dish> {
    const newUser = this.dishRepository.create(user);
    return await this.dishRepository.save(newUser);
  }

  // update user
  async update(id: number, user: Dish): Promise<Dish> {
    await this.dishRepository.update(id, user);
    return await this.dishRepository.findOne({ where: { id } });
  }

  // delete user
  async delete(id: number): Promise<void> {
    await this.dishRepository.delete(id);
  }
}
