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
import { DislikedService } from './disliked.service';
import { Disliked } from './disliked.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';

@ApiTags('Disliked')
@Controller('disliked')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class DislikedController {
  constructor(private readonly dislikedService: DislikedService) {
    dislikedService: dislikedService;
  }

  // Get all disliked
  @Get()
  async findAll(): Promise<Disliked[]> {
    console.log('ccc');
    return await this.dislikedService.findAll();
  }
  @ApiOperation({
    summary: 'Get disliked',
    description: 'Get disliked by id',
  })
  // Get one Disliked
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Disliked> {
    const disliked = await this.dislikedService.findOne(id);
    if (!disliked) {
      throw new Error('Disliked not found');
    }
    return disliked;
  }

  // Create disliked
  @Post()
  async create(@Body() disliked: Disliked): Promise<Disliked> {
    return await this.dislikedService.create(disliked);
  }

  // Update disliked
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() disliked: Disliked,
  ): Promise<Disliked> {
    return this.dislikedService.update(id, disliked);
  }

  // Delete disliked
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if user not found
    const disliked = await this.dislikedService.findOne(id);
    if (!disliked) {
      throw new Error('User not found');
    }
    return this.dislikedService.delete(id);
  }
}
