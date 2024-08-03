import { Module } from '@nestjs/common';
import { ReportReviewsService } from './report-reviews.service';
import { ReportReviewsController } from './report-reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { ReportReview } from './entities/report-review.entity';
import { Review } from 'src/reviews/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ReportReview, Review])],
  controllers: [ReportReviewsController],
  providers: [ReportReviewsService],
})
export class ReportReviewsModule {}
