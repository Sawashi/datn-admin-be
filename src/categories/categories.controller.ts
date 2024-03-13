import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {
    categoriesService: categoriesService;
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }
  @ApiOperation({
    summary: 'Get category',
    description: 'Get a category by id',
  })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Category> {
    const category = await this.categoriesService.findOne(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  @Post()
  async create(@Body() category: Category): Promise<Category> {
    return await this.categoriesService.create(category);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() category: Category,
  ): Promise<Category> {
    return this.categoriesService.update(id, category);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    const category = await this.categoriesService.findOne(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return this.categoriesService.delete(id);
  }
}
