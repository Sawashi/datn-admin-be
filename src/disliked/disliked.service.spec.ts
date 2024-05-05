import { Test, TestingModule } from '@nestjs/testing';
import { DislikedService } from './disliked.service';

describe('DislikedService', () => {
  let service: DislikedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DislikedService],
    }).compile();

    service = module.get<DislikedService>(DislikedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
