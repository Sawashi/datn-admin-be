import { Test, TestingModule } from '@nestjs/testing';
import { PersonalizeController } from './Personalize.controller';

describe('PersonalizeController', () => {
  let controller: PersonalizeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonalizeController],
    }).compile();

    controller = module.get<PersonalizeController>(PersonalizeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
