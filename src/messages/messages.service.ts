import { Injectable } from '@nestjs/common';
import { Message } from './message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {
    messagesRepository: messagesRepository;
  }
  // get all messages
  async findall(): Promise<Message[]> {
    return await this.messagesRepository.find();
  }

  // get one user
  async findOne(id: number): Promise<Message> {
    return await this.messagesRepository.findOne({ where: { id } });
  }

  //create user
  async create(user: Message): Promise<Message> {
    const newUser = this.messagesRepository.create(user);
    return await this.messagesRepository.save(newUser);
  }

  // update user
  async update(id: number, user: Message): Promise<Message> {
    await this.messagesRepository.update(id, user);
    return await this.messagesRepository.findOne({ where: { id } });
  }

  // delete user
  async delete(id: number): Promise<void> {
    await this.messagesRepository.delete(id);
  }
}
