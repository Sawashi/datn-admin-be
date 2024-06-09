import { Test, TestingModule } from '@nestjs/testing';
import { DislikedIngredientService } from './disliked-ingredient.service';

describe('DislikedIngredientService', () => {
  let service: DislikedIngredientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DislikedIngredientService],
    }).compile();

    service = module.get<DislikedIngredientService>(DislikedIngredientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
