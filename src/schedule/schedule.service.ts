import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {
    scheduleRepository: scheduleRepository;
  }
  // get all schedule
  async findall(): Promise<Schedule[]> {
    return await this.scheduleRepository.find();
  }

  // get one user
  async findOne(id: number): Promise<Schedule> {
    return await this.scheduleRepository.findOne({ where: { id } });
  }

  //create user
  async create(user: Schedule): Promise<Schedule> {
    const newUser = this.scheduleRepository.create(user);
    return await this.scheduleRepository.save(newUser);
  }

  // update user
  async update(id: number, user: Schedule): Promise<Schedule> {
    await this.scheduleRepository.update(id, user);
    return await this.scheduleRepository.findOne({ where: { id } });
  }

  // delete user
  async delete(id: number): Promise<void> {
    await this.scheduleRepository.delete(id);
  }
}
