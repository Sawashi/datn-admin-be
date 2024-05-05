import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AllergiesService } from './allergies.service';
import { Allergies } from './allergies.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Allergies')
@Controller('allergies')
export class AllergiesController {
  constructor(private readonly allergiesService: AllergiesService) {
    allergiesService: allergiesService;
  }

  // Get all cuisines
  @Get()
  async findAll(): Promise<Allergies[]> {
    console.log('ccc');
    return await this.allergiesService.findAll();
  }
  @ApiOperation({
    summary: 'Get allergies',
    description: 'Get allergies by id',
  })
  // Get one cuisine
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Allergies> {
    const allergies = await this.allergiesService.findOne(id);
    if (!allergies) {
      throw new Error('Allergies not found');
    }
    return allergies;
  }

  // Create cuisine
  @Post()
  async create(@Body() allergies: Allergies): Promise<Allergies> {
    return await this.allergiesService.create(allergies);
  }

  // Update cuisine
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() allergies: Allergies,
  ): Promise<Allergies> {
    return this.allergiesService.update(id, allergies);
  }

  // Delete cuisine
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if user not found
    const allergies = await this.allergiesService.findOne(id);
    if (!allergies) {
      throw new Error('User not found');
    }
    return this.allergiesService.delete(id);
  }
}
