import { Test, TestingModule } from '@nestjs/testing';
import { ReportReviewsController } from './report-reviews.controller';
import { ReportReviewsService } from './report-reviews.service';

describe('ReportReviewsController', () => {
  let controller: ReportReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportReviewsController],
      providers: [ReportReviewsService],
    }).compile();

    controller = module.get<ReportReviewsController>(ReportReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
