import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Taboos } from './taboos.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaboosService {
  constructor(
    @InjectRepository(Taboos)
    private taboosRepository: Repository<Taboos>,
  ) {
    taboosRepository: taboosRepository;
  }
  //get all taboos
  async findAll(): Promise<Taboos[]> {
    return await this.taboosRepository.find();
  }
  //get one taboo
  async findOne(id: number): Promise<Taboos> {
    return await this.taboosRepository.findOne({ where: { id } });
  }
  //create taboo
  async create(taboo: Taboos): Promise<Taboos> {
    const newTaboo = this.taboosRepository.create(taboo);
    return await this.taboosRepository.save(newTaboo);
  }
  //update taboo
  async update(id: number, taboo: Taboos): Promise<Taboos> {
    await this.taboosRepository.update(id, taboo);
    return await this.taboosRepository.findOne({ where: { id } });
  }
  //delete taboo
  async delete(id: number): Promise<void> {
    await this.taboosRepository.delete(id);
  }
  //check a string is a taboo
  async check(string: string): Promise<boolean> {
    const taboos = await this.taboosRepository.find();
    return taboos.some((taboo) => string.includes(taboo.word));
  }
}
