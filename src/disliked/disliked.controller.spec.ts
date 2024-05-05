import { Test, TestingModule } from '@nestjs/testing';
import { DislikedController } from './disliked.controller';

describe('DislikedController', () => {
  let controller: DislikedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DislikedController],
    }).compile();

    controller = module.get<DislikedController>(DislikedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
