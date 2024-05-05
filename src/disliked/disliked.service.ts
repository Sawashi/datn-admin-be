import { Injectable } from '@nestjs/common';
import { Disliked } from './disliked.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DislikedService {
  constructor(
    @InjectRepository(Disliked)
    private dislikedRepository: Repository<Disliked>,
  ) {
    dislikedRepository: dislikedRepository;
  }

  // get all disliked
  async findAll(): Promise<Disliked[]> {
    return await this.dislikedRepository.find();
  }

  // get one Disliked
  async findOne(id: number): Promise<Disliked> {
    return await this.dislikedRepository.findOne({ where: { id } });
  }

  //create Disliked
  async create(disliked: Disliked): Promise<Disliked> {
    const newDisliked = this.dislikedRepository.create(disliked);
    return await this.dislikedRepository.save(newDisliked);
  }

  // update Disliked
  async update(id: number, disliked: Disliked): Promise<Disliked> {
    await this.dislikedRepository.update(id, disliked);
    return await this.dislikedRepository.findOne({ where: { id } });
  }

  // delete Disliked
  async delete(id: number): Promise<void> {
    await this.dislikedRepository.delete(id);
  }
}
