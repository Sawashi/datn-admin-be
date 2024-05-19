import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Category } from './category.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/categories.dto';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {
    this.categoryService = categoryService;
  }
  //get all category
  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findall();
  }
  //get one category
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Category> {
    const category = await this.categoryService.findOne(id);
    if (!category) {
      throw new Error('Category not found');
    } else {
      return category;
    }
  }

  //create category
  @Post()
  async create(@Body() category: CreateCategoryDto): Promise<Category> {
    return await this.categoryService.create(category);
  }

  //update category
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() category: Category,
  ): Promise<Category> {
    return this.categoryService.update(id, category);
  }

  //delete category
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if category not found
    const category = await this.categoryService.findOne(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return this.categoryService.delete(id);
  }
}
