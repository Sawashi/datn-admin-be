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
import { CourseService } from './course.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
import { Courses } from './course.entity';

@ApiTags('Courses')
@Controller('courses')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class CourseController {
  constructor(private readonly coursesService: CourseService) {
    coursesService: coursesService;
  }

  // Get all courses
  @Get()
  async findAll(): Promise<Courses[]> {
    return await this.coursesService.findAll();
  }
  @ApiOperation({
    summary: 'Get course',
    description: 'Get course by id',
  })
  // Get one courses
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Courses> {
    const courses = await this.coursesService.findOne(id);
    if (!courses) {
      throw new Error('courses not found');
    }
    return courses;
  }

  // Create courses
  @Post()
  async create(@Body() courses: Courses): Promise<Courses> {
    return await this.coursesService.create(courses);
  }

  // Update courses
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() courses: Courses,
  ): Promise<Courses> {
    return this.coursesService.update(id, courses);
  }

  // Delete courses
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if user not found
    const courses = await this.coursesService.findOne(id);
    if (!courses) {
      throw new Error('User not found');
    }
    return this.coursesService.delete(id);
  }
}
