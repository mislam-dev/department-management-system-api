import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report, ReportType } from './entities/report.entity';
import { ReportService } from './report.service';

describe('ReportService', () => {
  let service: ReportService;
  let repository: Record<string, jest.Mock>;

  const mockReport = {
    id: 'report-id',
    title: 'Report',
    description: 'Content',
    type: ReportType.ANALYTICS,
    generatedById: 'user-id',
    generatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getRepositoryToken(Report),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    repository = module.get(getRepositoryToken(Report));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a report', async () => {
      const createDto: CreateReportDto & { generatedById: string } = {
        title: 'Report',
        description: 'Content',
        type: ReportType.ANALYTICS,
        generatedById: 'user-id',
      };

      mockRepository.create.mockReturnValue(mockReport);
      mockRepository.save.mockResolvedValue(mockReport);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockReport);
      expect(result).toEqual(mockReport);
    });
  });

  describe('findAll', () => {
    it('should return all reports', async () => {
      const limit = 10;
      const offset = 0;
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([[mockReport], total]);

      const result = await service.findAll({ limit, offset });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: offset,
        take: limit,
        order: { generatedAt: 'desc' },
      });
      expect(result).toEqual({ total, limit, offset, results: [mockReport] });
    });
  });
});
