import { Injectable } from '@nestjs/common';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {
    categoryRepository: categoryRepository;
  }
  // get all category
  async findall(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  // get one category
  async findOne(id: number): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  //create category
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new Category();
    category.name = createCategoryDto.name;
    category.imgUrl = createCategoryDto.imgUrl;
    category.createdAt = new Date(); // Set createdAt manually
    category.updatedAt = new Date(); // Set updatedAt manually

    return await this.categoryRepository.save(category);
  }

  // update category
  async update(id: number, category: Category): Promise<Category> {
    await this.categoryRepository.update(id, category);
    return await this.categoryRepository.findOne({ where: { id } });
  }

  // delete category
  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
