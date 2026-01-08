import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CourseService } from 'src/course/course.service';
import { CourseScheduleService } from './course_schedule.service';
import { CreateCourseScheduleDto } from './dto/create-course_schedule.dto';
import { UpdateCourseScheduleDto } from './dto/update-course_schedule.dto';
import { CourseSchedule } from './entities/course_schedule.entity';

describe('CourseScheduleService', () => {
  let service: CourseScheduleService;
  let repository: any;
  let courseService: any;

  const mockSchedule = {
    id: 'schedule-id',
    courseId: 'course-id',
    dayOfWeek: 'Monday',
    startTime: '10:00',
    endTime: '11:00',
    roomNo: '101',
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockCourseService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseScheduleService,
        {
          provide: getRepositoryToken(CourseSchedule),
          useValue: mockRepository,
        },
        {
          provide: CourseService,
          useValue: mockCourseService,
        },
      ],
    }).compile();

    service = module.get<CourseScheduleService>(CourseScheduleService);
    repository = module.get(getRepositoryToken(CourseSchedule));
    courseService = module.get(CourseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a schedule', async () => {
      const createDto: CreateCourseScheduleDto = {
        dayOfWeek: 'Monday',
        startTime: '10:00',
        endTime: '11:00',
        room: '100',
      };

      mockCourseService.findOne.mockResolvedValue({ id: 'course-id' });
      mockRepository.create.mockReturnValue(mockSchedule);
      mockRepository.save.mockResolvedValue(mockSchedule);

      const result = await service.create('course-id', createDto);

      expect(courseService.findOne).toHaveBeenCalledWith('course-id');
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        courseId: 'course-id',
      });
      expect(repository.save).toHaveBeenCalledWith(mockSchedule);
      expect(result).toEqual(mockSchedule);
    });
  });

  describe('findAll', () => {
    it('should return all schedules for a course', async () => {
      const limit = 10;
      const offset = 0;
      const courseId = 'course-id';
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([[mockSchedule], total]);

      const result = await service.findAll(courseId, { limit, offset });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { courseId },
        skip: offset,
        take: limit,
      });
      expect(result).toEqual({ total, limit, offset, results: [mockSchedule] });
    });
  });

  describe('findOne', () => {
    it('should return a schedule', async () => {
      mockRepository.findOne.mockResolvedValue(mockSchedule);
      const result = await service.findOne('id');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'id' } });
      expect(result).toEqual(mockSchedule);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a schedule', async () => {
      const updateDto: UpdateCourseScheduleDto = { room: '102' };
      mockRepository.findOne.mockResolvedValue(mockSchedule);
      const updatedSchedule = { ...mockSchedule, ...updateDto };
      mockRepository.save.mockResolvedValue(updatedSchedule);

      const result = await service.update('id', updateDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'id' } });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
      expect(result).toEqual(updatedSchedule);
    });
  });

  describe('remove', () => {
    it('should remove a schedule', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      await service.remove('id');
      expect(repository.delete).toHaveBeenCalledWith({ id: 'id' });
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('id')).rejects.toThrow(NotFoundException);
    });
  });
});
