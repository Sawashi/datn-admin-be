import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './notes.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {
    this.notesService = notesService;
  }
  //get all note
  @Get()
  async findAll(): Promise<Note[]> {
    return await this.notesService.findall();
  }
  @Get('/user/:userId/dish/:dishId')
  async findByUserId(
    @Param('userId') userId: number,
    @Param('dishId') dishId: number,
  ): Promise<Note[]> {
    return await this.notesService.findAllByUserIdAndDish(userId, dishId);
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
  // @Post()
  // async create(@Body() note: Note): Promise<Note> {
  //   return await this.notesService.create(note);
  // }
  @Post()
  async create(
    @Body('noteTitle') noteTitle: string,
    @Body('noteContent') noteContent: string,
    @Body('dishId') dishId: number,
    @Body('userId') userId: number,
  ): Promise<Note> {
    return this.notesService.create(noteTitle, noteContent, dishId, userId);
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
