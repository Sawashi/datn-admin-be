import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from './schedule.entity';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {
    this.scheduleService = scheduleService;
  }
  //get all schedule
  @Get()
  async findAll(): Promise<Schedule[]> {
    return await this.scheduleService.findall();
  }
  //get one schedule
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Schedule> {
    const schedule = await this.scheduleService.findOne(id);
    if (!schedule) {
      throw new Error('Schedule not found');
    } else {
      return schedule;
    }
  }

  //create schedule
  @Post()
  async create(@Body() schedule: Schedule): Promise<Schedule> {
    return await this.scheduleService.create(schedule);
  }

  //update schedule
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() schedule: Schedule,
  ): Promise<Schedule> {
    return this.scheduleService.update(id, schedule);
  }

  //delete schedule
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if schedule not found
    const schedule = await this.scheduleService.findOne(id);
    if (!schedule) {
      throw new Error('Schedule not found');
    }
    return this.scheduleService.delete(id);
  }
}
