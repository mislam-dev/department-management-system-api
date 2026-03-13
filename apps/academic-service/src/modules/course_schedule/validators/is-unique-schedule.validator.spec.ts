import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ValidationArguments } from 'class-validator';
import { CreateCourseScheduleDto } from '../dto/create-course_schedule.dto';
import { CourseSchedule } from '../entities/course_schedule.entity';
import { IsUniqueScheduleConstraint } from './is-unique-schedule.validator';

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
  findOne: jest.fn(),
};

describe('IsUniqueScheduleConstraint', () => {
  let validator: IsUniqueScheduleConstraint;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsUniqueScheduleConstraint,
        {
          provide: getRepositoryToken(CourseSchedule),
          useValue: mockRepository,
        },
      ],
    }).compile();

    validator = module.get(IsUniqueScheduleConstraint);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('validate', () => {
    it('should return true if schedule is unique', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await validator.validate(null, args);
      expect(result).toBe(true);
    });

    it('should return false if schedule already exists', async () => {
      mockRepository.findOne.mockResolvedValue({
        id: 'existing',
      });

      const result = await validator.validate(null, args);
      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return default message', () => {
      expect(validator.defaultMessage()).toBe(
        'A schedule with the same course, day, time, room, and teacher already exists.',
      );
    });
  });
});
