import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackAppsController } from './feedback-apps.controller';
import { FeedbackAppsService } from './feedback-apps.service';

describe('FeedbackAppsController', () => {
  let controller: FeedbackAppsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackAppsController],
      providers: [FeedbackAppsService],
    }).compile();

    controller = module.get<FeedbackAppsController>(FeedbackAppsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
