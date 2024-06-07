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
import { DislikedIngredientService } from './disliked-ingredient.service';
import { DislikedIngredients } from './disliked-ingredient.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';

@ApiTags('Disliked Ingredient')
@Controller('disliked-ingredient')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class DislikedIngredientController {
  constructor(private readonly dislikedsService: DislikedIngredientService) {
    dislikedsService: dislikedsService;
  }

  // Get all dislikeds
  @Get()
  async findAll(): Promise<DislikedIngredients[]> {
    console.log('ccc');
    return await this.dislikedsService.findAll();
  }
  @ApiOperation({
    summary: 'Get disliked',
    description: 'Get disliked by id',
  })
  // Get one dislikeds
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<DislikedIngredients> {
    const dislikeds = await this.dislikedsService.findOne(id);
    if (!dislikeds) {
      throw new Error('dislikeds not found');
    }
    return dislikeds;
  }

  // Create dislikeds
  @Post()
  async create(
    @Body() dislikeds: DislikedIngredients,
  ): Promise<DislikedIngredients> {
    return await this.dislikedsService.create(dislikeds);
  }

  // Update dislikeds
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dislikeds: DislikedIngredients,
  ): Promise<DislikedIngredients> {
    return this.dislikedsService.update(id, dislikeds);
  }

  // Delete dislikeds
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if user not found
    const dislikeds = await this.dislikedsService.findOne(id);
    if (!dislikeds) {
      throw new Error('User not found');
    }
    return this.dislikedsService.delete(id);
  }
}
