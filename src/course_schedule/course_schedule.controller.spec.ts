import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { CourseScheduleController } from './course_schedule.controller';
import { CourseScheduleService } from './course_schedule.service';
import { CreateCourseScheduleDto } from './dto/create-course_schedule.dto';
import { UpdateCourseScheduleDto } from './dto/update-course_schedule.dto';

const mockCourseId = 'course-id';
const mockId = 'schedule-id';
const mockSchedule = {
  id: mockId,
  courseId: mockCourseId,
  dayOfWeek: 'Monday',
  startTime: '10:00',
  endTime: '11:00',
  roomNo: '101',
};
const mockCourseScheduleService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const createDto: CreateCourseScheduleDto = {
  dayOfWeek: 'Monday',
  startTime: '10:00',
  endTime: '11:00',
  room: '100',
};
const updateDto: UpdateCourseScheduleDto = { room: '102' };

describe('CourseScheduleController', () => {
  let controller: CourseScheduleController;

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a schedule', async () => {
      mockCourseScheduleService.create.mockResolvedValue(mockSchedule);

      const result = await controller.create(mockCourseId, createDto);

      expect(mockCourseScheduleService.create).toHaveBeenCalledWith(
        mockCourseId,
        createDto,
      );
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

      const result = await controller.findAll(mockCourseId, pagination);

      expect(mockCourseScheduleService.findAll).toHaveBeenCalledWith(
        mockCourseId,
        {
          limit: 10,
          offset: 0,
        },
      );
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a schedule', async () => {
      mockCourseScheduleService.findOne.mockResolvedValue(mockSchedule);
      const result = await controller.findOne('id');
      expect(mockCourseScheduleService.findOne).toHaveBeenCalledWith('id');
      expect(result).toEqual(mockSchedule);
    });
  });

  describe('update', () => {
    it('should update a schedule', async () => {
      mockCourseScheduleService.update.mockResolvedValue({
        ...mockSchedule,
        ...updateDto,
      });
      const result = await controller.update(mockId, updateDto);
      expect(mockCourseScheduleService.update).toHaveBeenCalledWith(
        mockId,
        updateDto,
      );
      expect(result).toEqual({ ...mockSchedule, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should remove a schedule', async () => {
      mockCourseScheduleService.remove.mockResolvedValue(undefined);
      await controller.remove(mockId);
      expect(mockCourseScheduleService.remove).toHaveBeenCalledWith(mockId);
    });
  });
});
