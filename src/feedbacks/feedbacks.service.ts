import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedBacks } from './feedbacks.entity';
import { CreateOrUpdateFeedbackDto } from './dto/feedbacks.dto';

@Injectable()
export class FeedbacksService {
  constructor(
    @InjectRepository(FeedBacks)
    private feedbacksRepository: Repository<FeedBacks>,
  ) {
    feedbacksRepository;
  }

  async createOrUpdateFeedback(
    dto: CreateOrUpdateFeedbackDto,
  ): Promise<FeedBacks> {
    let feedback = await this.feedbacksRepository.findOne({
      where: { userid: dto.userid },
    });

    if (feedback) {
      feedback.likePoint = dto.likePoint;
      feedback.reason = dto.reason;
      feedback.description = dto.description;
      feedback = await this.feedbacksRepository.save(feedback);
    } else {
      feedback = this.feedbacksRepository.create(dto);
      feedback = await this.feedbacksRepository.save(feedback);
    }

    return feedback;
  }
}
