import { Test, TestingModule } from '@nestjs/testing';
import { TaboosController } from './taboos.controller';

describe('TaboosController', () => {
  let controller: TaboosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaboosController],
    }).compile();

    controller = module.get<TaboosController>(TaboosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
