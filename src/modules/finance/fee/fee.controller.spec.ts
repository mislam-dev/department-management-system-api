import { Test, TestingModule } from '@nestjs/testing';
import { FeeController } from './fee.controller';
import { FeeService } from './fee.service';

describe('FeeController', () => {
  let controller: FeeController;

  const mockFeeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeeController],
      providers: [
        {
          provide: FeeService,
          useValue: mockFeeService,
        },
      ],
    }).compile();

    controller = module.get<FeeController>(FeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
