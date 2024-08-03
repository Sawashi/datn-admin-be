import { Test, TestingModule } from '@nestjs/testing';
import { ReportReviewsService } from './report-reviews.service';

describe('ReportReviewsService', () => {
  let service: ReportReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportReviewsService],
    }).compile();

    service = module.get<ReportReviewsService>(ReportReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
