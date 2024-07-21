import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CuisinesService } from './cuisines.service';
import { Cuisine } from './cuisine.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';

@ApiTags('Cuisines')
@Controller('cuisines')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class CuisinesController {
  constructor(private readonly cuisinesService: CuisinesService) {
    cuisinesService: cuisinesService;
  }

  //Get all cuisines
  @Get()
  async findAll(): Promise<Cuisine[]> {
    console.log('ccc');
    return await this.cuisinesService.findAll();
  }
  @Get('pagin')
  @ApiOperation({
    summary: 'Get all cuisines',
    description: 'Retrieve all cuisines with their dishes and ingredients',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll1(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{
    data: Cuisine[];
    count: number;
    currentPage: number;
    totalPages: number;
  }> {
    return await this.cuisinesService.findAll1(page, limit);
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

  @Post()
  @ApiOperation({
    summary: 'Create cuisine',
    description: 'Create a new cuisine with an image file',
  })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() cuisine: Cuisine,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Cuisine> {
    return await this.cuisinesService.create(cuisine, image);
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
