import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportReviewDto } from './dto/create-report-review.dto';
import { ReportReview } from './entities/report-review.entity';
import { User } from 'src/users/user.entity';
import { Review } from 'src/reviews/review.entity';

@Injectable()
export class ReportReviewsService {
  constructor(
    @InjectRepository(ReportReview)
    private reportReviewRepository: Repository<ReportReview>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {
    reportReviewRepository: reportReviewRepository;
    reviewRepository: reviewRepository;
  }
  async create(loginUser: User, createReportReviewDto: CreateReportReviewDto) {
    const { reviewId, reason } = createReportReviewDto;

    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    const existingReport = await this.reportReviewRepository.findOne({
      where: {
        review: { id: reviewId },
        user: { id: loginUser.id },
      },
    });

    if (existingReport) {
      throw new ConflictException('You have already reported this review');
    }

    const reportReview = this.reportReviewRepository.create({
      review,
      reason,
      user: loginUser,
    });

    const newReportReview =
      await this.reportReviewRepository.save(reportReview);

    return newReportReview;
  }

  async findAll(): Promise<ReportReview[]> {
    return await this.reportReviewRepository.find({
      relations: {
        user: true,
        review: true,
      },
    });
  }

  async findOne(id: number): Promise<ReportReview> {
    const found = await this.reportReviewRepository.findOne({ where: { id } });

    if (!found) throw new NotFoundException(`Review with id ${id} not found`);
    return found;
  }

  // update(id: number, updateReportReviewDto: UpdateReportReviewDto) {
  //   return `This action updates a #${id} reportReview`;
  // }

  async remove(id: number): Promise<void> {
    const result = await this.reportReviewRepository.delete(id);

    if (result.affected === 0)
      throw new NotFoundException(`Review with id ${id} not found`);
  }
}
