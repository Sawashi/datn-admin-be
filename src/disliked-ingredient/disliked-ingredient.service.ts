import { Injectable } from '@nestjs/common';
import { DislikedIngredients } from './disliked-ingredient.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class DislikedIngredientService {
  constructor(
    @InjectRepository(DislikedIngredients)
    private dislikedsRepository: Repository<DislikedIngredients>,
  ) {
    dislikedsRepository: dislikedsRepository;
  }

  // get all dislikeds
  async findAll(): Promise<DislikedIngredients[]> {
    return await this.dislikedsRepository.find({
      relations: {
        ingredients: true,
      },
    });
  }

  // get one dislikeds
  async findOne(id: number): Promise<DislikedIngredients> {
    return await this.dislikedsRepository.findOne({ where: { id } });
  }

  //create dislikeds
  async create(dislikeds: DislikedIngredients): Promise<DislikedIngredients> {
    const newdislikeds = this.dislikedsRepository.create(dislikeds);
    return await this.dislikedsRepository.save(newdislikeds);
  }

  // update dislikeds
  async update(
    id: number,
    dislikeds: DislikedIngredients,
  ): Promise<DislikedIngredients> {
    await this.dislikedsRepository.update(id, dislikeds);
    return await this.dislikedsRepository.findOne({ where: { id } });
  }

  // delete dislikeds
  async delete(id: number): Promise<void> {
    await this.dislikedsRepository.delete(id);
  }
}
