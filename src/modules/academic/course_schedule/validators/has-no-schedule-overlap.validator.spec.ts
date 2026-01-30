import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ValidationArguments } from 'class-validator';
import { CreateCourseScheduleDto } from '../dto/create-course_schedule.dto';
import { CourseSchedule } from '../entities/course_schedule.entity';
import { HasNoScheduleOverlapConstraint } from './has-no-schedule-overlap.validator';

const mockCourseScheduleRepository = {
  find: jest.fn(),
};

const data: Partial<CreateCourseScheduleDto> & { courseId: string } = {
  courseId: 'course1',
  dayOfWeek: 'Monday',
  startTime: '10:00',
  endTime: '11:00',
};

const args: ValidationArguments = {
  object: data,
  constraints: [],
  property: '',
  targetName: '',
  value: '',
};

describe('HasNoScheduleOverlapConstraint', () => {
  let validator: HasNoScheduleOverlapConstraint;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HasNoScheduleOverlapConstraint,
        {
          provide: getRepositoryToken(CourseSchedule),
          useValue: mockCourseScheduleRepository,
        },
      ],
    }).compile();

    validator = module.get<HasNoScheduleOverlapConstraint>(
      HasNoScheduleOverlapConstraint,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return true if no overlapping schedules found', async () => {
      mockCourseScheduleRepository.find?.mockResolvedValue([]);

      const result = await validator.validate(null, args);
      expect(result).toBe(true);
    });

    it('should return false if overlapping schedule exists', async () => {
      mockCourseScheduleRepository.find?.mockResolvedValue([
        { startTime: '10:30', endTime: '11:30' } as CourseSchedule,
      ]);

      const result = await validator.validate(null, args);
      expect(mockCourseScheduleRepository.find).toHaveBeenCalledWith({
        where: {
          courseId: data.courseId,
          dayOfWeek: data.dayOfWeek,
        },
      });
      expect(result).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return correct error message', () => {
      const message = validator.defaultMessage();
      expect(message).toBe(
        `This course already has a schedule that overlaps with this time.`,
      );
    });
  });
});
