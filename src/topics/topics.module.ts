import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './topic.entity';
import { Record } from 'src/record/record.entity';
import { Message } from 'src/messages/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Topic, Record, Message])],
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule {}
