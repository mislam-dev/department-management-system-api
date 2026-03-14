import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Fee } from './entities/fee.entity';
import { FeeService } from './fee.service';

describe('FeeService', () => {
  let service: FeeService;

  const mockFeeRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeeService,
        {
          provide: getRepositoryToken(Fee),
          useValue: mockFeeRepository,
        },
      ],
    }).compile();

    service = module.get<FeeService>(FeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
