import { Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {
    categoriesRepository: categoriesRepository;
  }

  async findAll(): Promise<Category[]> {
    return await this.categoriesRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    return await this.categoriesRepository.findOne({ where: { id } });
  }

  async create(category: Category): Promise<Category> {
    const newCategory = this.categoriesRepository.create(category);
    return await this.categoriesRepository.save(newCategory);
  }

  async update(id: number, category: Category): Promise<Category> {
    await this.categoriesRepository.update(id, category);
    return await this.categoriesRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.categoriesRepository.delete(id);
  }
}
