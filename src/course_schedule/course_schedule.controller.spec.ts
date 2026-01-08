import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { CourseScheduleController } from './course_schedule.controller';
import { CourseScheduleService } from './course_schedule.service';
import { CreateCourseScheduleDto } from './dto/create-course_schedule.dto';
import { UpdateCourseScheduleDto } from './dto/update-course_schedule.dto';

describe('CourseScheduleController', () => {
  let controller: CourseScheduleController;
  let service: any;

  const mockSchedule = {
    id: 'schedule-id',
    courseId: 'course-id',
  };

  const mockCourseScheduleService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseScheduleController],
      providers: [
        {
          provide: CourseScheduleService,
          useValue: mockCourseScheduleService,
        },
      ],
    }).compile();

    controller = module.get<CourseScheduleController>(CourseScheduleController);
    service = module.get<CourseScheduleService>(CourseScheduleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a schedule', async () => {
      const createDto: CreateCourseScheduleDto = {
        dayOfWeek: 'Monday',
        startTime: '10:00',
        endTime: '11:00',
        roomNo: '101',
      };

      mockCourseScheduleService.create.mockResolvedValue(mockSchedule);

      const result = await controller.create('course-id', createDto);

      expect(service.create).toHaveBeenCalledWith('course-id', createDto);
      expect(result).toEqual(mockSchedule);
    });
  });

  describe('findAll', () => {
    it('should return all schedules', async () => {
      const pagination: PaginationDto = { limit: 10, offset: 0 };
      const expected = {
        total: 1,
        limit: 10,
        offset: 0,
        results: [mockSchedule],
      };
      mockCourseScheduleService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll('course-id', pagination);

      expect(service.findAll).toHaveBeenCalledWith('course-id', {
        limit: 10,
        offset: 0,
      });
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a schedule', async () => {
      mockCourseScheduleService.findOne.mockResolvedValue(mockSchedule);
      const result = await controller.findOne('id');
      expect(service.findOne).toHaveBeenCalledWith('id');
      expect(result).toEqual(mockSchedule);
    });
  });

  describe('update', () => {
    it('should update a schedule', async () => {
      const updateDto: UpdateCourseScheduleDto = { roomNo: '102' };
      mockCourseScheduleService.update.mockResolvedValue({
        ...mockSchedule,
        ...updateDto,
      });
      const result = await controller.update('id', updateDto);
      expect(service.update).toHaveBeenCalledWith('id', updateDto);
      expect(result).toEqual({ ...mockSchedule, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should remove a schedule', async () => {
      mockCourseScheduleService.remove.mockResolvedValue(undefined);
      await controller.remove('id');
      expect(service.remove).toHaveBeenCalledWith('id');
    });
  });
});
