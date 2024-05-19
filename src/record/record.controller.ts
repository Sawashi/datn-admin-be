import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { Record } from './record.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecordCreateDto } from './dto/record-create.dto';
import { RecordUpdateDto } from './dto/record-update.dto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';

@ApiTags('Record')
@Controller('record')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class RecordController {
  constructor(private readonly recordService: RecordService) {
    recordService: recordService;
  }

  // Get all Record
  @Get()
  async findAll(): Promise<Record[]> {
    return await this.recordService.findAll();
  }
  @ApiOperation({
    summary: 'Get Record',
    description: 'Get Record by id',
  })
  // Get one Record
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Record> {
    const record = await this.recordService.findOne(id);
    if (!record) {
      throw new Error('Record not found');
    }
    return record;
  }

  // Create Record
  @Post()
  async create(@Body() recordCreateDto: RecordCreateDto): Promise<Record> {
    return await this.recordService.create(recordCreateDto);
  }

  // Update Record
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() recordUpdateDto: RecordUpdateDto,
  ) {
    return this.recordService.update(id, recordUpdateDto);
  }

  // Delete Record
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if user not found
    const record = await this.recordService.findOne(id);
    if (!record) {
      throw new Error('User not found');
    }
    return this.recordService.delete(id);
  }
}
