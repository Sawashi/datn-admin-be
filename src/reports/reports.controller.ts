import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
import { CreateReportDto } from './dto/createReportDto.dto';
@ApiTags('Reports')
@Controller('reports')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {
    reportsService: reportsService;
  }
  // Get all reports
  @Get()
  async findAll(): Promise<Report[]> {
    return await this.reportsService.findAll();
  }

  @Get('/user')
  async getReportsForUser(@GetUser() user: User): Promise<Report[]> {
    return await this.reportsService.getReportsForUser(user);
  }

  @ApiOperation({
    summary: 'Get report',
    description: 'Get report by id',
  })
  // Get one report
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Report> {
    const report = await this.reportsService.findOne(id);
    if (!report) {
      throw new Error('Report not found');
    }
    return report;
  }

  // Create report
  @Post()
  async create(@Body() reportCreateDto: CreateReportDto) {
    try {
      return await this.reportsService.create(reportCreateDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Update report
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() report: Report,
  ): Promise<Report> {
    return this.reportsService.update(id, report);
  }

  // Delete report
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    const report = await this.reportsService.findOne(id);
    if (!report) {
      throw new Error('Report not found');
    }
    return this.reportsService.delete(id);
  }

  @Get('/user/:userId/dish/:dishId')
  async findByUserId(
    @Param('userId') userId: number,
    @Param('dishId') dishId: number,
  ): Promise<Report[]> {
    return await this.reportsService.findReportByUserIdAndDish(userId, dishId);
  }
}
