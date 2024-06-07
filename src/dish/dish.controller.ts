import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { Dish } from './dish.entity';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { DishDto } from './dto/dishDto.dto';
import { DishPatchDto } from './dto/dishPatchDto.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
import { PaginationDto } from './dto/pagination.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
@ApiTags('Dishes')
@Controller('dish')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class DishController {
  constructor(
    private readonly dishService: DishService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    this.dishService = dishService;
    cloudinaryService: cloudinaryService;
  }
  //get all dish
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<{ data: Dish[]; count: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    return await this.dishService.findAll({ page, limit });
  }

  @Get('latest')
  async getLatest(
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('limit') limit?: number,
  ): Promise<Dish[]> {
    return this.dishService.findByCreated(sort, limit);
  }

  // get dish by search text
  @Get('search')
  async search(
    @Query('text') text: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('cookingTime') cookingTime?: string,
    @Query('ingredientIds') ingredientIds?: number[],
    @Query('cuisineIds') cuisineIds?: number[],
    @Query('dietIds') dietIds?: number[],
  ): Promise<Dish[]> {
    return this.dishService.findDishBySearchText(
      text,
      sort,
      cookingTime,
      ingredientIds,
      cuisineIds,
      dietIds,
    );
  }

  @Get('recommend')
  async recommend(@GetUser() loginUser: User): Promise<Dish[]> {
    if (!loginUser.id) {
      throw new NotFoundException('User not found');
    }
    return this.dishService.recommendDishes(loginUser.id);
  }

  @Get('healthy')
  async healthy(@Query('dietCount') dietCount: number): Promise<Dish[]> {
    return this.dishService.getHealthyDishes(dietCount);
  }

  @Get('healthy-v2')
  async healthyV2(
    @Query('dietName') dietNames: string[] | string,
  ): Promise<Dish[]> {
    return this.dishService.getHealthyDishesV2(dietNames);
  }

  @Get('quickly')
  async quickly(
    @Query('ingredientCount') ingredientCount: number,
  ): Promise<Dish[]> {
    return this.dishService.getQuicklyDishes(ingredientCount);
  }

  //get one dish
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Dish> {
    const dish = await this.dishService.findOne(id);
    if (!dish) {
      throw new Error('Dish not found');
    } else {
      return dish;
    }
  }

  //create dish
  @Post()
  @UseInterceptors(FileInterceptor('image')) // 'file' should match the field name in the form data
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dishDto: DishDto,
  ): Promise<Dish> {
    // Upload file to Cloudinary
    const uploadedImage = await this.cloudinaryService.uploadImage(file);
    return this.dishService.create(dishDto, uploadedImage.secure_url);
  }

  //update dish
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image')) // 'file' should match the field name in the form data
  async update(
    @Param('id')
    id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dishPatchDto: DishPatchDto,
  ): Promise<Dish> {
    if (file !== undefined) {
      const uploadedImage = await this.cloudinaryService.uploadImage(file);
      dishPatchDto.imageUrl = uploadedImage.secure_url;
    }
    return this.dishService.update(id, dishPatchDto);
  }

  //delete dish
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if dish not found
    const dish = await this.dishService.findOne(id);
    if (!dish) {
      throw new Error('Dish not found');
    }
    return this.dishService.delete(id);
  }

  @Get('related/:dishId')
  async getRelatedDishesByName(
    @Param('dishId') dishId: number,
  ): Promise<Dish[]> {
    return this.dishService.findRelatedDishes(dishId);
  }
}
