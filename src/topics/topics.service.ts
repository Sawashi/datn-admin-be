import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './topic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,
  ) {
    topicsRepository: topicsRepository;
  }
  // get all topics
  async findall(): Promise<Topic[]> {
    return await this.topicsRepository.find();
  }

  // get one user
  async findOne(id: number): Promise<Topic> {
    return await this.topicsRepository.findOne({ where: { id } });
  }

  //create user
  async create(user: Topic): Promise<Topic> {
    const newUser = this.topicsRepository.create(user);
    return await this.topicsRepository.save(newUser);
  }

  // update user
  async update(id: number, user: Topic): Promise<Topic> {
    await this.topicsRepository.update(id, user);
    return await this.topicsRepository.findOne({ where: { id } });
  }

  // delete user
  async delete(id: number): Promise<void> {
    await this.topicsRepository.delete(id);
  }
}
