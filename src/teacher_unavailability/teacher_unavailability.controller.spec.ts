import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { CreateTeacherUnavailabilityDto } from './dto/create-teacher_unavailability.dto';
import { UpdateTeacherUnavailabilityDto } from './dto/update-teacher_unavailability.dto';
import { TeacherUnavailabilityController } from './teacher_unavailability.controller';
import { TeacherUnavailabilityService } from './teacher_unavailability.service';

describe('TeacherUnavailabilityController', () => {
  let controller: TeacherUnavailabilityController;
  let service: Record<string, jest.Mock>;

  const mockData = {
    id: 'id',
    reason: 'sick',
  };

  const mockTeacherUnavailabilityService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherUnavailabilityController],
      providers: [
        {
          provide: TeacherUnavailabilityService,
          useValue: mockTeacherUnavailabilityService,
        },
      ],
    }).compile();

    controller = module.get<TeacherUnavailabilityController>(
      TeacherUnavailabilityController,
    );
    service = module.get<TeacherUnavailabilityService>(
      TeacherUnavailabilityService,
    ) as unknown as Record<string, jest.Mock>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create data', async () => {
      const createDto: CreateTeacherUnavailabilityDto = {
        reason: 'sick',
        startDatetime: new Date().toISOString(),
        endDatetime: new Date().toISOString(),
      };
      const teacherId = 'teacher-id';

      mockTeacherUnavailabilityService.create.mockResolvedValue(mockData);

      const result = await controller.create(createDto, { teacherId });

      expect(service.create).toHaveBeenCalledWith({ ...createDto, teacherId });
      expect(result).toEqual(mockData);
    });
  });

  describe('findAll', () => {
    it('should return all data', async () => {
      const pagination: PaginationDto = { limit: 10, offset: 0 };
      const teacherId = 'teacher-id';
      const expected = { total: 1, limit: 10, offset: 0, results: [mockData] };

      mockTeacherUnavailabilityService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll({ teacherId }, pagination);

      expect(service.findAll).toHaveBeenCalledWith({
        ...pagination,
        teacherId,
      });
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should update data', async () => {
      const updateDto: UpdateTeacherUnavailabilityDto = { reason: 'updated' };
      mockTeacherUnavailabilityService.update.mockResolvedValue({
        ...mockData,
        ...updateDto,
      });
      const result = await controller.update('id', updateDto);
      expect(service.update).toHaveBeenCalledWith('id', updateDto);
      expect(result).toEqual({ ...mockData, ...updateDto });
    });
  });
});
