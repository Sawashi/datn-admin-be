import { Injectable } from '@nestjs/common';
import { Personalize } from './personalize.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PersonalizeService {
  constructor(
    @InjectRepository(Personalize)
    private personalizeRepository: Repository<Personalize>,
  ) {
    personalizeRepository: personalizeRepository;
  }

  // get all Personalize
  async findAll(): Promise<Personalize[]> {
    return await this.personalizeRepository.find({
      relations: {
        user: true,
        allergies: true,
        diets: true,
        cuisines: true,
      },
    });
  }

  // get one Personalize
  async findOne(id: number): Promise<Personalize> {
    return await this.personalizeRepository.findOne({ where: { id } });
  }

  //create Personalize
  async create(personalize: Personalize): Promise<Personalize> {
    const newPersonalize = this.personalizeRepository.create(personalize);
    return await this.personalizeRepository.save(newPersonalize);
  }

  // update Personalize
  async update(id: number, personalize: Personalize): Promise<Personalize> {
    await this.personalizeRepository.update(id, personalize);
    return await this.personalizeRepository.findOne({ where: { id } });
  }

  // delete Personalize
  async delete(id: number): Promise<void> {
    await this.personalizeRepository.delete(id);
  }
}
