import { Injectable } from '@nestjs/common';
import { Personalize } from './personalize.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Allergies } from 'src/allergies/allergies.entity';
import { Diets } from 'src/diets/diets.entity';
import { Cuisine } from 'src/cuisines/cuisine.entity';
import { UpdatePersonalizeDto } from './dto/update-personalize.dto';
import { Ingredient } from 'src/ingredient/ingredient.entity';
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
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {
    personalizeRepository: personalizeRepository;
    allergyRepository: allergyRepository;
    dietRepository: dietRepository;
    cuisineRepository: cuisineRepository;
    ingredientRepository: ingredientRepository;
  }

  // get all Personalize
  async findAll(): Promise<Personalize[]> {
    return await this.personalizeRepository.find({
      relations: {
        user: true,
        allergies: true,
        diets: true,
        cuisines: true,
        ingredients: true,
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
        ingredients: true,
      },
    });
  }

  //create Personalize
  async create(personalize: Personalize): Promise<Personalize> {
    const { user, allergies, diets, cuisines, ingredients } = personalize;
    const allergyEntities = await this.allergyRepository.findByIds(allergies);
    const dietEntities = await this.dietRepository.findByIds(diets);
    const cuisineEntities = await this.cuisineRepository.findByIds(cuisines);
    const dislikedEntities =
      await this.cuisineRepository.findByIds(ingredients);
    const newPersonalize = this.personalizeRepository.create({
      user: user,
      cuisines: cuisineEntities,
      allergies: allergyEntities,
      diets: dietEntities,
      ingredients: dislikedEntities,
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

    const { allergies, diets, cuisines, dislikeds } = updatePersonalizeDto;

    if (allergies !== undefined) {
      const allergyEntities = await this.allergyRepository.findByIds(allergies);
      personalize.allergies = allergyEntities;
    }
    if (diets !== undefined) {
      const dietEntities = await this.dietRepository.findByIds(diets);
      personalize.diets = dietEntities;
    }
    if (cuisines !== undefined) {
      const cuisineEntities = await this.cuisineRepository.findByIds(cuisines);
      personalize.cuisines = cuisineEntities;
    }
    if (dislikeds !== undefined) {
      const dislikedsEntities =
        await this.ingredientRepository.findByIds(dislikeds);
      personalize.ingredients = dislikedsEntities;
    }
    return this.personalizeRepository.save(personalize);
  }

  // delete Personalize
  async delete(id: number): Promise<void> {
    await this.personalizeRepository.delete(id);
  }
}
