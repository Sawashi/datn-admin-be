import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    usersRepository: usersRepository;
  }

  // get all users
  async findall(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  // get one user
  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  //create user
  async create(user: User): Promise<User> {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  // update user
  async update(id: number, user: User): Promise<User> {
    await this.usersRepository.update(id, user);
    return await this.usersRepository.findOne({ where: { id } });
  }

  // delete user
  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
  // change user status
  async changeStatus(id: number, status: string): Promise<User> {
    await this.usersRepository.update(id, { status });
    return await this.usersRepository.findOne({ where: { id } });
  }
}
