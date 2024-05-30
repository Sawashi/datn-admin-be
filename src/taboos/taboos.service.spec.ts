import { Test, TestingModule } from '@nestjs/testing';
import { TaboosService } from './taboos.service';

describe('TaboosService', () => {
  let service: TaboosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaboosService],
    }).compile();

    service = module.get<TaboosService>(TaboosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
