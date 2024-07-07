import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackAppDto } from './dto/create-feedback-app.dto';
import { UpdateFeedbackAppDto } from './dto/update-feedback-app.dto';
import { User } from 'src/users/user.entity';
import { FeedbackApps } from './entities/feedback-app.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FeedbackAppsService {
  constructor(
    @InjectRepository(FeedbackApps)
    private feedbackAppsRepository: Repository<FeedbackApps>,
  ) {
    feedbackAppsRepository: feedbackAppsRepository;
  }
  async create(
    loginUser: User,
    createFeedbackAppDto: CreateFeedbackAppDto,
  ): Promise<FeedbackApps> {
    const feedback = this.feedbackAppsRepository.create({
      ...createFeedbackAppDto,
      user: loginUser,
    });
    return this.feedbackAppsRepository.save(feedback);
  }

  findAll(): Promise<FeedbackApps[]> {
    return this.feedbackAppsRepository.find({
      relations: ['user'],
      where: { isDelete: null },
    });
  }

  async findOne(id: number): Promise<FeedbackApps> {
    const feedback = await this.feedbackAppsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return feedback;
  }

  async update(
    id: number,
    updateFeedbackAppDto: UpdateFeedbackAppDto,
  ): Promise<FeedbackApps> {
    const feedback = await this.findOne(id);
    Object.assign(feedback, updateFeedbackAppDto);
    return this.feedbackAppsRepository.save(feedback);
  }

  async remove(id: number): Promise<void> {
    const feedback = await this.findOne(id);

    // soft delete
    feedback.isDelete = true;
    await this.feedbackAppsRepository.save(feedback);
  }
}
