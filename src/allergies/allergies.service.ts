import { Injectable } from '@nestjs/common';
import { Allergies } from './allergies.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AllergiesService {
  constructor(
    @InjectRepository(Allergies)
    private allergiesRepository: Repository<Allergies>,
  ) {
    allergiesRepository: allergiesRepository;
  }

  // get all cuisines
  async findAll(): Promise<Allergies[]> {
    return await this.allergiesRepository.find();
  }

  // get one cuisine
  async findOne(id: number): Promise<Allergies> {
    return await this.allergiesRepository.findOne({ where: { id } });
  }

  //create cuisine
  async create(allergies: Allergies): Promise<Allergies> {
    const newAllergie = this.allergiesRepository.create(allergies);
    return await this.allergiesRepository.save(newAllergie);
  }

  // update cuisine
  async update(id: number, allergies: Allergies): Promise<Allergies> {
    await this.allergiesRepository.update(id, allergies);
    return await this.allergiesRepository.findOne({ where: { id } });
  }

  // delete cuisine
  async delete(id: number): Promise<void> {
    await this.allergiesRepository.delete(id);
  }
}
