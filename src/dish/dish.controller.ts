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
} from '@nestjs/common';
import { DishService } from './dish.service';
import { Dish } from './dish.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { DishDto } from './dto/dishDto.dto';
import { DishPatchDto } from './dto/dishPatchDto.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
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
  async findAll(): Promise<Dish[]> {
    return await this.dishService.findall();
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

  // get dish by search text
  @Get('search/:text')
  async search(@Param('text') text: string): Promise<Dish[]> {
    return this.dishService.findDishBySearchText(text);
  }
}
