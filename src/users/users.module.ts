import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Collection } from 'src/collections/collection.entity';
import { Topic } from 'src/topics/topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Collection, Topic])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
