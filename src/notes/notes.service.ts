import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './notes.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {
    noteRepository: noteRepository;
  }
  // get all note
  async findall(): Promise<Note[]> {
    return await this.noteRepository.find({
      relations: {
        user: true,
        dish: true,
      },
    });
  }

  // get one note
  async findOne(id: number): Promise<Note> {
    return await this.noteRepository.findOne({ where: { id } });
  }

  //create note
  async create(note: Note): Promise<Note> {
    const newnote = this.noteRepository.create(note);
    return await this.noteRepository.save(newnote);
  }

  // update note
  async update(id: number, note: Note): Promise<Note> {
    await this.noteRepository.update(id, note);
    return await this.noteRepository.findOne({ where: { id } });
  }

  // delete note
  async delete(id: number): Promise<void> {
    await this.noteRepository.delete(id);
  }
}
