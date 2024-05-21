import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './topic.entity';
import { Repository, Between, LessThanOrEqual } from 'typeorm';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { TopicUpdateDto } from './dto/topic-update.dto';
import { Record } from 'src/record/record.entity';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {
    topicsRepository: topicsRepository;
    recordRepository: recordRepository;
  }
  // get all topics
  async findall(): Promise<Topic[]> {
    return await this.topicsRepository.find({
      where: { isActive: true },
      order: {
        createDate: 'DESC',
      },
    });
  }

  // get one topic
  async findOne(id: number): Promise<Topic> {
    return await this.topicsRepository.findOne({ where: { id } });
  }

  //create topic
  async create(topic: Topic): Promise<Topic> {
    const newTopic = this.topicsRepository.create(topic);
    return await this.topicsRepository.save(newTopic);
  }

  // update topic
  async update(id: number, topicUpdateDto: TopicUpdateDto): Promise<Topic> {
    const topic = await this.topicsRepository.findOne({
      where: { id },
    });

    if (!topic) {
      throw new Error('Topic not found');
    }

    const { recordId, ...otherProps } = topicUpdateDto;

    if (recordId) {
      const recordEntity = await this.recordRepository.findOne({
        where: { id: recordId },
      });
      if (recordEntity) topic.record = recordEntity;
      else {
        throw new Error('Record not found');
      }
    }
    Object.assign(topic, otherProps);
    return this.topicsRepository.save(topic);
  }

  // delete topic
  async delete(id: number): Promise<void> {
    await this.topicsRepository.update(id, { isActive: false });
  }

  async getTopicByUserId(id: number) {
    return await this.topicsRepository.find({
      where: {
        user: { id: id },
        isActive: true,
      },
      order: {
        createDate: 'DESC',
      },
      relations: {
        record: true,
      },
    });
  }

  async getTopicByDateRanges(id: number) {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const twoDaysAgo = subDays(today, 2);
    const sevenDaysAgo = subDays(today, 7);
    const todayTopic = await this.topicsRepository.find({
      where: {
        user: { id: id },
        createDate: Between(startOfDay(today), endOfDay(today)),
        isActive: true,
      },
      order: {
        createDate: 'DESC',
      },
    });

    const yesterdayTopic = await this.topicsRepository.find({
      where: {
        user: { id: id },
        createDate: Between(startOfDay(yesterday), endOfDay(yesterday)),
        isActive: true,
      },
    });

    const previous7DaysTopic = await this.topicsRepository.find({
      where: {
        user: { id: id },
        createDate: Between(startOfDay(sevenDaysAgo), endOfDay(twoDaysAgo)),
        isActive: true,
      },
    });

    const previous30DaysTopic = await this.topicsRepository.find({
      where: {
        user: { id: id },
        createDate: LessThanOrEqual(endOfDay(sevenDaysAgo)),
        isActive: true,
      },
    });

    return {
      Today: todayTopic,
      Yesterday: yesterdayTopic,
      'Previous 7 Days': previous7DaysTopic,
      'Previous 30 Days': previous30DaysTopic,
    };
  }
}
