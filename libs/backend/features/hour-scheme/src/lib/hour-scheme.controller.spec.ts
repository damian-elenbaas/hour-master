import { Test, TestingModule } from '@nestjs/testing';
import { HourSchemeController } from './hour-scheme.controller';

describe('HourSchemeController', () => {
  let controller: HourSchemeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HourSchemeController],
    }).compile();

    controller = module.get<HourSchemeController>(HourSchemeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
