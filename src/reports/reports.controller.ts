import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';

import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {
    reportsService: reportsService;
  }
  // Get all reports
  @Get()
  async findAll(): Promise<Report[]> {
    return await this.reportsService.findAll();
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
  async create(@Body() report: Report): Promise<Report> {
    return await this.reportsService.create(report);
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
}
