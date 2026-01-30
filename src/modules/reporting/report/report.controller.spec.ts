import { Test, TestingModule } from '@nestjs/testing';
import { UserPayload } from 'src/core/authentication/auth/decorators/user.decorator';
import { CreateReportDto } from './dto/create-report.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { ReportType } from './entities/report.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

describe('ReportController', () => {
  let controller: ReportController;
  let service: Record<string, jest.Mock>;

  const mockReport = {
    id: 'report-id',
    title: 'Report',
  };

  const mockReportService = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: mockReportService,
        },
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    service = module.get<ReportService>(ReportService) as unknown as Record<
      string,
      jest.Mock
    >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a report', async () => {
      const createDto: CreateReportDto = {
        title: 'Report',
        description: 'Content',
        type: ReportType.ANALYTICS,
      };
      const user = {
        userId: 'user-id',
        email: 'email',
        auth0_sub: 'sub',
        auth0_role: 'role',
      } as unknown as UserPayload;

      mockReportService.create.mockResolvedValue(mockReport);

      const result = await controller.create(createDto, user);

      expect(service.create).toHaveBeenCalledWith({
        ...createDto,
        generatedById: 'user-id',
      });
      expect(result).toEqual(mockReport);
    });
  });

  describe('findAll', () => {
    it('should return reports', async () => {
      const query: FindAllQueryDto = { limit: 10, offset: 0 };
      const expected = {
        total: 1,
        limit: 10,
        offset: 0,
        results: [mockReport],
      };
      mockReportService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0 });
      expect(result).toEqual(expected);
    });
  });
});
