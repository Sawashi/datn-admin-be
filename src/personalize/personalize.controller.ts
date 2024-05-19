import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PersonalizeService } from './personalize.service';
import { Personalize } from './personalize.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdatePersonalizeDto } from './dto/update-personalize.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';

@ApiTags('Personalize')
@Controller('personalize')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class PersonalizeController {
  constructor(private readonly personalizeService: PersonalizeService) {
    personalizeService: personalizeService;
  }

  // Get all Personalize
  @Get()
  async findAll(): Promise<Personalize[]> {
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
  async replace(
    @Param('id') id: number,
    @Body() personalize: Personalize,
  ): Promise<Personalize> {
    return this.personalizeService.replace(id, personalize);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() personalizeDto: UpdatePersonalizeDto,
  ) {
    return this.personalizeService.update(id, personalizeDto);
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
