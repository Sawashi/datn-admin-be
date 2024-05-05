import { Test, TestingModule } from '@nestjs/testing';
import { PersonalizeService } from './personalize.service';

describe('PersonalizeService', () => {
  let service: PersonalizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonalizeService],
    }).compile();

    service = module.get<PersonalizeService>(PersonalizeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
