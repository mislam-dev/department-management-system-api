import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ValidationArguments } from 'class-validator';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';
import { Attendance, AttendanceStatus } from '../entities/attendance.entity';
import { IsUniqueAttendanceConstraint } from './is-unique-attendance.validator';

const mockId = 'uuid-id';

const mockRepository = {
  findOne: jest.fn(),
};

const mockData: CreateAttendanceDto = {
  studentId: 'student-id',
  courseScheduleId: 'schedule-id',
  date: new Date().toISOString(),
  checkInTime: new Date().toISOString(),
  status: AttendanceStatus.PRESENT,
};

const args: ValidationArguments = {
  object: mockData,
  value: mockId,
  constraints: [],
  targetName: 'attendance',
  property: 'studentId',
};

describe('IsUniqueAttendanceConstraint', () => {
  let constraints: IsUniqueAttendanceConstraint;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IsUniqueAttendanceConstraint,
        {
          provide: getRepositoryToken(Attendance),
          useValue: mockRepository,
        },
      ],
    }).compile();

    constraints = module.get(IsUniqueAttendanceConstraint);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(constraints).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if this attendance is unique', async () => {
      mockRepository.findOne.mockResolvedValue({ id: mockId });

      const isValid = await constraints.validate(mockId, args);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: {
          studentId: mockData.studentId,
          date: mockData.date,
          courseScheduleId: mockData.courseScheduleId,
          ...(mockData.checkInTime
            ? { checkInTime: mockData.checkInTime }
            : {}),
        },
      });
      console.log(isValid);
      expect(isValid).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return correct error message', () => {
      const message = constraints.defaultMessage();
      expect(message).toBe(
        'Attendance record already exists for this student, date, course schedule, and check-in time.',
      );
    });
  });
});
