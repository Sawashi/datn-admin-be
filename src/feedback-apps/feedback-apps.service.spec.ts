import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackAppsService } from './feedback-apps.service';

describe('FeedbackAppsService', () => {
  let service: FeedbackAppsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedbackAppsService],
    }).compile();

    service = module.get<FeedbackAppsService>(FeedbackAppsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
