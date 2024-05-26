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
import { DietsService } from './diets.service';
import { Diets } from './diets.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';

@ApiTags('Diets')
@Controller('diets')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class DietsController {
  constructor(private readonly dietsService: DietsService) {
    dietsService: dietsService;
  }

  // Get all Diets
  @Get()
  async findAll(): Promise<Diets[]> {
    console.log('ccc');
    return await this.dietsService.findAll();
  }
  @ApiOperation({
    summary: 'Get diet',
    description: 'Get diet by id',
  })
  // Get one Diets
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Diets> {
    const diets = await this.dietsService.findOne(id);
    if (!diets) {
      throw new Error('Diets not found');
    }
    return diets;
  }

  // Create Diets
  @Post()
  async create(@Body() diets: Diets): Promise<Diets> {
    return await this.dietsService.create(diets);
  }

  // Update Diets
  @Put(':id')
  async update(@Param('id') id: number, @Body() diets: Diets): Promise<Diets> {
    return this.dietsService.update(id, diets);
  }

  // Delete Diets
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if user not found
    const diets = await this.dietsService.findOne(id);
    if (!diets) {
      throw new Error('User not found');
    }
    return this.dietsService.delete(id);
  }
}
