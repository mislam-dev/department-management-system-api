import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CourseService } from 'src/course/course.service';
import { CourseScheduleService } from './course_schedule.service';
import { CreateCourseScheduleDto } from './dto/create-course_schedule.dto';
import { UpdateCourseScheduleDto } from './dto/update-course_schedule.dto';
import { CourseSchedule } from './entities/course_schedule.entity';

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
const createDto: CreateCourseScheduleDto = {
  dayOfWeek: 'Monday',
  startTime: '10:00',
  endTime: '11:00',
  room: '100',
};
const updateDto: UpdateCourseScheduleDto = { room: '102' };

describe('CourseScheduleService', () => {
  let service: CourseScheduleService;

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a schedule', async () => {
      mockCourseService.findOne.mockResolvedValue({ id: mockCourseId });
      mockRepository.create.mockReturnValue(mockSchedule);
      mockRepository.save.mockResolvedValue(mockSchedule);

      const result = await service.create(mockCourseId, createDto);

      expect(mockCourseService.findOne).toHaveBeenCalledWith(mockCourseId);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        courseId: mockCourseId,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockSchedule);
      expect(result).toEqual(mockSchedule);
    });

    it('should throw NotFoundException if course not found', async () => {
      mockCourseService.findOne.mockRejectedValue(new NotFoundException());
      await expect(service.create('invalid id', createDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCourseService.findOne).toHaveBeenCalledWith('invalid id');
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
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

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
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
      const result = await service.findOne(mockId);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockId },
      });
      expect(result).toEqual(mockSchedule);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOne.mockRejectedValue(new NotFoundException());
      await expect(service.findOne(mockId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a schedule', async () => {
      mockRepository.findOne.mockResolvedValue(mockSchedule);
      const updatedSchedule = { ...mockSchedule, ...updateDto };
      mockRepository.save.mockResolvedValue(updatedSchedule);

      const result = await service.update(mockId, updateDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockId },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
      expect(result).toEqual(updatedSchedule);
    });
    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOne.mockRejectedValue(new NotFoundException());
      await expect(service.update(mockId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockId },
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a schedule', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      await service.remove(mockId);
      expect(mockRepository.delete).toHaveBeenCalledWith({ id: mockId });
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.delete.mockRejectedValue(new NotFoundException());
      await expect(service.remove(mockId)).rejects.toThrow(NotFoundException);
    });
  });
});
