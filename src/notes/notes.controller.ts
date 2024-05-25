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
import { NotesService } from './notes.service';
import { Note } from './notes.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';

@ApiTags('Notes')
@Controller('notes')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class NotesController {
  constructor(private readonly notesService: NotesService) {
    this.notesService = notesService;
  }
  //get all note
  @Get()
  async findAll(): Promise<Note[]> {
    return await this.notesService.findall();
  }
  //get one note
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Note> {
    const note = await this.notesService.findOne(id);
    if (!note) {
      throw new Error('note not found');
    } else {
      return note;
    }
  }

  //create note
  @Post()
  async create(@Body() note: Note): Promise<Note> {
    return await this.notesService.create(note);
  }

  //update note
  @Put(':id')
  async update(@Param('id') id: number, @Body() note: Note): Promise<Note> {
    return this.notesService.update(id, note);
  }

  //delete note
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if note not found
    const note = await this.notesService.findOne(id);
    if (!note) {
      throw new Error('note not found');
    }
    return this.notesService.delete(id);
  }
}
