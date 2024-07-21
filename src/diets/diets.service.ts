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
        dishes: {
          dishToIngredients: {
            ingredient: true,
          },
        },
      },
      where: {
        dishes: {
          deletedAt: null,
        },
      },
    });
  }

  async findAll1(
    page: number,
    limit: number,
  ): Promise<{
    data: Diets[];
    count: number;
    currentPage: number;
    totalPages: number;
  }> {
    const [result, total] = await this.dietsRepository.findAndCount({
      relations: {
        dishes: {
          dishToIngredients: {
            ingredient: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: result,
      count: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // get one Diets
  async findOne(id: number): Promise<Diets> {
    return await this.dietsRepository.findOne({
      where: { id },
      relations: {
        dishes: {
          dishToIngredients: {
            ingredient: true,
          },
        },
      },
    });
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
