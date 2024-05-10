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
    return await this.dishRepository.find({
      relations: {
        reviews: true,
        notes: true,
        ingredients: true,
      },
    });
  }

  // get one dish
  async findOne(id: number): Promise<Dish> {
    return await this.dishRepository.findOne({ where: { id } });
  }

  //create dish
  async create(dish: Dish): Promise<Dish> {
    const newdish = this.dishRepository.create(dish);
    return await this.dishRepository.save(newdish);
  }

  // update dish
  async update(id: number, dish: Dish): Promise<Dish> {
    await this.dishRepository.update(id, dish);
    return await this.dishRepository.findOne({ where: { id } });
  }

  // delete dish
  async delete(id: number): Promise<void> {
    await this.dishRepository.delete(id);
  }
}
