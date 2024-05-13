import { Injectable } from '@nestjs/common';
import { Diets } from './diets.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DietsService {
  constructor(
    @InjectRepository(Diets)
    private dietsRepository: Repository<Diets>,
  ) {
    dietsRepository: dietsRepository;
  }

  // get all diets
  async findAll(): Promise<Diets[]> {
    return await this.dietsRepository.find({
      relations: {
        dishes: true,
      },
    });
  }

  // get one Diets
  async findOne(id: number): Promise<Diets> {
    return await this.dietsRepository.findOne({ where: { id } });
  }

  //create Diets
  async create(diets: Diets): Promise<Diets> {
    const newDiets = this.dietsRepository.create(diets);
    return await this.dietsRepository.save(newDiets);
  }

  // update Diets
  async update(id: number, diets: Diets): Promise<Diets> {
    await this.dietsRepository.update(id, diets);
    return await this.dietsRepository.findOne({ where: { id } });
  }

  // delete Diets
  async delete(id: number): Promise<void> {
    await this.dietsRepository.delete(id);
  }
}
