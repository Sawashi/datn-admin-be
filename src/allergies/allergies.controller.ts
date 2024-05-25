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
import { AllergiesService } from './allergies.service';
import { Allergies } from './allergies.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';

@ApiTags('Allergies')
@Controller('allergies')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
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
