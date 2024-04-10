import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CuisinesService } from './cuisines.service';
import { Cuisine } from './cuisine.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Cuisines')
@Controller('cuisines')
export class CuisinesController {
  constructor(private readonly cuisinesService: CuisinesService) {
    cuisinesService: cuisinesService;
  }

  // Get all cuisines
  @Get()
  async findAll(): Promise<Cuisine[]> {
    console.log('ccc');
    return await this.cuisinesService.findAll();
  }
  @ApiOperation({
    summary: 'Get cuisine',
    description: 'Get cuisine by id',
  })
  // Get one cuisine
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Cuisine> {
    const cuisine = await this.cuisinesService.findOne(id);
    if (!cuisine) {
      throw new Error('Cuisine not found');
    }
    return cuisine;
  }

  // Create user
  @Post()
  async create(@Body() cuisine: Cuisine): Promise<Cuisine> {
    return await this.cuisinesService.create(cuisine);
  }

  // Update cuisine
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() cuisine: Cuisine,
  ): Promise<Cuisine> {
    return this.cuisinesService.update(id, cuisine);
  }

  // Delete cuisine
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if user not found
    const cuisine = await this.cuisinesService.findOne(id);
    if (!cuisine) {
      throw new Error('User not found');
    }
    return this.cuisinesService.delete(id);
  }
}
