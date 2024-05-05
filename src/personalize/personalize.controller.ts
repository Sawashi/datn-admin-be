import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PersonalizeService } from './personalize.service';
import { Personalize } from './personalize.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Personalize')
@Controller('personalize')
export class PersonalizeController {
  constructor(private readonly personalizeService: PersonalizeService) {
    personalizeService: personalizeService;
  }

  // Get all Personalize
  @Get()
  async findAll(): Promise<Personalize[]> {
    console.log('ccc');
    return await this.personalizeService.findAll();
  }
  @ApiOperation({
    summary: 'Get Personalize',
    description: 'Get Personalize by id',
  })
  // Get one Personalize
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Personalize> {
    const personalize = await this.personalizeService.findOne(id);
    if (!personalize) {
      throw new Error('Personalize not found');
    }
    return personalize;
  }

  // Create Personalize
  @Post()
  async create(@Body() personalize: Personalize): Promise<Personalize> {
    return await this.personalizeService.create(personalize);
  }

  // Update Personalize
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() personalize: Personalize,
  ): Promise<Personalize> {
    return this.personalizeService.update(id, personalize);
  }

  // Delete Personalize
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if user not found
    const personalize = await this.personalizeService.findOne(id);
    if (!personalize) {
      throw new Error('User not found');
    }
    return this.personalizeService.delete(id);
  }
}
