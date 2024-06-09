import { Test, TestingModule } from '@nestjs/testing';
import { DislikedIngredientController } from './disliked-ingredient.controller';

describe('DislikedIngredientController', () => {
  let controller: DislikedIngredientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DislikedIngredientController],
    }).compile();

    controller = module.get<DislikedIngredientController>(
      DislikedIngredientController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
