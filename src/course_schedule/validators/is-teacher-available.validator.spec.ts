import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ValidationArguments } from 'class-validator';
import { CreateCourseScheduleDto } from '../dto/create-course_schedule.dto';
import { CourseSchedule } from '../entities/course_schedule.entity';
import { IsTeacherAvailableConstraint } from './is-teacher-available.validator';

const data: Partial<CreateCourseScheduleDto> & { courseId: string } = {
  courseId: 'course1',
  dayOfWeek: 'Monday',
  startTime: '10:00',
  endTime: '11:00',
  room: '201',
  teacherId: 'teacher1',
};

const args: ValidationArguments = {
  object: data,
  constraints: [],
  property: '',
  targetName: '',
  value: '',
};

const mockRepository = {
  find: jest.fn(),
};

describe('IsTeacherAvailableConstraint', () => {
  let validator: IsTeacherAvailableConstraint;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsTeacherAvailableConstraint,
        {
          provide: getRepositoryToken(CourseSchedule),
          useValue: mockRepository,
        },
      ],
    }).compile();

    validator = module.get<IsTeacherAvailableConstraint>(
      IsTeacherAvailableConstraint,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should defined', () => {
    expect(validator).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if teacherId is not provided', async () => {
      const result = await validator.validate(null, {
        ...args,
        object: { ...data, teacherId: undefined },
      });
      expect(result).toBe(true);
    });

    it('should return true if teacher is free', async () => {
      mockRepository.find?.mockResolvedValue([]);

      const result = await validator.validate(null, args);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { teacherId: data.teacherId, dayOfWeek: data.dayOfWeek },
      });
      expect(result).toBe(true);
    });

    it('should return false if teacher is busy', async () => {
      mockRepository.find?.mockResolvedValue([
        { startTime: '10:00', endTime: '11:00' },
      ]);

      const result = await validator.validate(null, args);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { teacherId: data.teacherId, dayOfWeek: data.dayOfWeek },
      });
      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return default message', () => {
      expect(validator.defaultMessage()).toBe(
        'Teacher is not available during this time.',
      );
    });
  });
});
