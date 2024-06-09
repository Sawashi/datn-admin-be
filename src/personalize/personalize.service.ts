import { Injectable } from '@nestjs/common';
import { Personalize } from './personalize.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Allergies } from 'src/allergies/allergies.entity';
import { Diets } from 'src/diets/diets.entity';
import { Cuisine } from 'src/cuisines/cuisine.entity';
import { UpdatePersonalizeDto } from './dto/update-personalize.dto';
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
    return await this.personalizeRepository.findOne({
      where: { id },
      relations: {
        user: true,
        allergies: true,
        diets: true,
        cuisines: true,
      },
    });
  }

  // get one Personalize
  async findPersonalizeUser(id: number): Promise<Personalize> {
    return await this.personalizeRepository.findOne({
      where: { user: { id: id } },
      relations: {
        allergies: true,
        diets: true,
        cuisines: true,
      },
    });
  }

  //create Personalize
  async create(personalize: Personalize): Promise<Personalize> {
    const { user, allergies, diets, cuisines } = personalize;
    const allergyEntities = await this.allergyRepository.findByIds(allergies);
    const dietEntities = await this.dietRepository.findByIds(diets);
    const cuisineEntities = await this.cuisineRepository.findByIds(cuisines);

    if (allergies.length !== allergyEntities.length) {
      throw new Error('Some allergies not found');
    }

    if (diets.length !== dietEntities.length) {
      throw new Error('Some diets not found');
    }

    if (cuisines.length !== cuisineEntities.length) {
      throw new Error('Some cuisines not found');
    }

    const newPersonalize = this.personalizeRepository.create({
      user: user,
      cuisines: cuisineEntities,
      allergies: allergyEntities,
      diets: dietEntities,
    });
    return await this.personalizeRepository.save(newPersonalize);
  }

  // replace Personalize
  async replace(id: number, personalize: Personalize): Promise<Personalize> {
    await this.personalizeRepository.update(id, personalize);
    return await this.personalizeRepository.findOne({ where: { id } });
  }

  // update Personalize
  async update(
    id: number,
    updatePersonalizeDto: UpdatePersonalizeDto,
  ): Promise<Personalize> {
    const personalize = await this.personalizeRepository.findOne({
      where: { id },
    });

    if (!personalize) {
      throw new Error('Personalize not found');
    }

    const { allergies, diets, cuisines } = updatePersonalizeDto;

    if (allergies !== undefined) {
      const allergyEntities = await this.allergyRepository.findByIds(allergies);
      if (allergyEntities.length !== allergies.length) {
        throw new Error('Allergies not found');
      }
      personalize.allergies = allergyEntities;
    }
    if (diets !== undefined) {
      const dietEntities = await this.dietRepository.findByIds(diets);
      if (dietEntities.length !== diets.length) {
        throw new Error('Diets not found');
      }
      personalize.diets = dietEntities;
    }
    if (cuisines !== undefined) {
      const cuisineEntities = await this.cuisineRepository.findByIds(cuisines);
      if (cuisineEntities.length !== cuisines.length) {
        throw new Error('Cuisines not found');
      }
      personalize.cuisines = cuisineEntities;
    }

    return this.personalizeRepository.save(personalize);
  }

  // delete Personalize
  async delete(id: number): Promise<void> {
    await this.personalizeRepository.delete(id);
  }
}
