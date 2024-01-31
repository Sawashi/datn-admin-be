import { Injectable } from '@nestjs/common';
import { Cuisine } from './cuisine.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CuisinesService {
  constructor(
    @InjectRepository(Cuisine)
    private usersRepository: Repository<Cuisine>,
  ) {}
}
