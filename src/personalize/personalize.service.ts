import { Injectable } from '@nestjs/common';
import { Personalize } from './personalize.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Allergies } from 'src/allergies/allergies.entity';
import { Diets } from 'src/diets/diets.entity';
import { Cuisine } from 'src/cuisines/cuisine.entity';
@Injectable()
export class PersonalizeService {
  constructor(
    @InjectRepository(Personalize)
    private personalizeRepository: Repository<Personalize>,
    @InjectRepository(Allergies)
    private allergyRepository: Repository<Allergies>,
    @InjectRepository(Diets)
    private dietRepository: Repository<Diets>,
    @InjectRepository(Cuisine)
    private cuisineRepository: Repository<Cuisine>,
  ) {
    personalizeRepository: personalizeRepository;
    allergyRepository: allergyRepository;
    dietRepository: dietRepository;
    cuisineRepository: cuisineRepository;
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
    const { user, allergies, diets, cuisines } = personalize;
    const allergyEntities = await this.allergyRepository.findByIds(allergies);
    const dietEntities = await this.dietRepository.findByIds(diets);
    const cuisineEntities = await this.cuisineRepository.findByIds(cuisines);

    const newPersonalize = this.personalizeRepository.create({
      user: user,
      cuisines: cuisineEntities,
      allergies: allergyEntities,
      diets: dietEntities,
    });
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
