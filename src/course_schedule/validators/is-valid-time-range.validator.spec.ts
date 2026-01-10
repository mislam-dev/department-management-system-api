import { Test, TestingModule } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';
import { CreateCourseScheduleDto } from '../dto/create-course_schedule.dto';
import { IsValidTimeRangeConstraint } from './is-valid-time-range.validator';

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

describe('IsValidTimeRangeConstraint', () => {
  let validator: IsValidTimeRangeConstraint;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IsValidTimeRangeConstraint],
    }).compile();

    validator = module.get(IsValidTimeRangeConstraint);
  });

  it('should return true if start < end', () => {
    expect(validator.validate(null, args)).toBe(true);
  });

  it('should return false if start >= end', () => {
    expect(
      validator.validate(null, {
        ...args,
        object: {
          ...args.object,
          startTime: '11:00',
          endTime: '11:00',
        },
      }),
    ).toBe(false);

    expect(
      validator.validate(null, {
        ...args,
        object: {
          ...args.object,
          startTime: '12:00',
          endTime: '11:00',
        },
      }),
    ).toBe(false);
  });

  it('should return true if inputs are missing (let other validators handle it)', () => {
    const result = validator.validate(null, args);
    expect(result).toBe(true);
  });

  describe('defaultMessage', () => {
    it('should return default message', () => {
      expect(validator.defaultMessage()).toBe(
        'startTime must be earlier than endTime.',
      );
    });
  });
});
