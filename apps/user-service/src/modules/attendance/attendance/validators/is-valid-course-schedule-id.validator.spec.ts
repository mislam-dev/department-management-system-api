import { Test } from '@nestjs/testing';
import { GrpcCourseScheduleServiceClient } from '../grpc/course-schedule.client';
import { IsValidCourseScheduleIdConstraint } from './is-valid-course-schedule-id.validator';

const mockId = 'uuid-id';

describe('IsValidCourseScheduleIdConstraint', () => {
  let constraints: IsValidCourseScheduleIdConstraint;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IsValidCourseScheduleIdConstraint,
        {
          provide: GrpcCourseScheduleServiceClient,
          useValue: {
            getCourseScheduleById: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    constraints = module.get<IsValidCourseScheduleIdConstraint>(
      IsValidCourseScheduleIdConstraint,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(constraints).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if course schedule exists (placeholder)', async () => {
      const isValid = await constraints.validate(mockId);
      expect(isValid).toBe(true);
    });
    it('should return false if course schedule id is empty/null', async () => {
      const isValid = await constraints.validate('');
      expect(isValid).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return correct error message', () => {
      const message = constraints.defaultMessage();
      expect(message).toBe('courseScheduleId must be valid!');
    });
  });
});
