import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';

describe('ActivityController', () => {
  let controller: ActivityController;
  let service: any;

  const mockActivity = {
    id: 'id',
    title: 'title',
  };

  const mockActivityService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        {
          provide: ActivityService,
          useValue: mockActivityService,
        },
      ],
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
    service = module.get<ActivityService>(ActivityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an activity', async () => {
      const createDto: CreateActivityDto = {
        title: 'title',
        description: 'desc',
      };
      mockActivityService.create.mockResolvedValue(mockActivity);

      const result = await controller.create(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockActivity);
    });
  });

  describe('findAll', () => {
    it('should return activities', async () => {
      const query: FindAllQueryDto = { limit: 10, offset: 0 };
      const expected = {
        total: 1,
        limit: 10,
        offset: 0,
        results: [mockActivity],
      };
      mockActivityService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);
      expect(service.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0 });
      expect(result).toEqual(expected);
    });
  });
});
