import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ValidationArguments } from 'class-validator';
import { CreateCourseScheduleDto } from '../dto/create-course_schedule.dto';
import { CourseSchedule } from '../entities/course_schedule.entity';
import { IsRoomAvailableConstraint } from './is-room-available.validator';

const data: Partial<CreateCourseScheduleDto> & { courseId: string } = {
  courseId: 'course1',
  dayOfWeek: 'Monday',
  startTime: '10:00',
  endTime: '11:00',
  room: '201',
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

describe('IsRoomAvailableConstraint', () => {
  let validator: IsRoomAvailableConstraint;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IsRoomAvailableConstraint,
        {
          provide: getRepositoryToken(CourseSchedule),
          useValue: mockRepository,
        },
      ],
    }).compile();

    validator = module.get<IsRoomAvailableConstraint>(
      IsRoomAvailableConstraint,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return true if room is not provided', async () => {
    const result = await validator.validate(null, {
      ...args,
      object: { ...data, room: undefined },
    });
    expect(result).toBe(true);
  });

  describe('validate', () => {
    it('should return true if no overlapping schedules for the room', async () => {
      mockRepository.find?.mockResolvedValue([]);

      const result = await validator.validate(null, args);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          room: data.room,
          dayOfWeek: data.dayOfWeek,
        },
      });
      expect(result).toBe(true);
    });

    it('should return false if room is booked during the time', async () => {
      mockRepository.find?.mockResolvedValue([
        { startTime: '10:00', endTime: '11:00' } as CourseSchedule,
      ]);

      const result = await validator.validate(null, args);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          room: data.room,
          dayOfWeek: data.dayOfWeek,
        },
      });
      expect(result).toBe(false);
    });
  });
  describe('defaultMessage', () => {
    it('should return default message', () => {
      expect(validator.defaultMessage()).toBe(
        'Room is already booked during this time.',
      );
    });
  });
});
