import { TaboosService } from './taboos.service';
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
import { Taboos } from './taboos.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Taboos')
@Controller('taboos')
export class TaboosController {
  constructor(private readonly taboosService: TaboosService) {
    taboosService: taboosService;
  }
  //get all taboos
  @Get()
  async findAll(): Promise<Taboos[]> {
    return await this.taboosService.findAll();
  }
  //get one taboo
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Taboos> {
    const taboo = await this.taboosService.findOne(id);
    if (!taboo) {
      throw new Error('Taboos not found');
    }
    return taboo;
  }
  //create taboo
  @Post()
  async create(@Body() taboo: Taboos): Promise<Taboos> {
    return await this.taboosService.create(taboo);
  }
  //update taboo
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() taboo: Taboos,
  ): Promise<Taboos> {
    return this.taboosService.update(id, taboo);
  }
  //delete taboo
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if taboo not found
    const taboo = await this.taboosService.findOne(id);
    if (!taboo) {
      throw new Error('Taboos not found');
    }
    return this.taboosService.delete(id);
  }
  //check a string is a taboo
  @Get('check/:string')
  async check(@Param('string') string: string): Promise<boolean> {
    return this.taboosService.check(string);
  }
}
