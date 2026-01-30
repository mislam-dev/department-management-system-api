import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CourseScheduleService } from 'src/modules/academic/course_schedule/course_schedule.service';
import { IsValidCourseScheduleIdConstraint } from './is-valid-course-schedule-id.validator';

const mockId = 'uuid-id';

const mockService = {
  findOne: jest.fn(),
};
describe('IsValidCourseScheduleIdConstraint', () => {
  let constraints: IsValidCourseScheduleIdConstraint;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IsValidCourseScheduleIdConstraint,
        {
          provide: CourseScheduleService,
          useValue: mockService,
        },
      ],
    }).compile();

    constraints = module.get(IsValidCourseScheduleIdConstraint);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(constraints).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if student is exist', async () => {
      mockService.findOne.mockResolvedValue({ id: mockId });
      const isValid = await constraints.validate(mockId);
      expect(mockService.findOne).toHaveBeenCalledWith(mockId);
      expect(isValid).toBe(true);
    });
    it('should return false if student id is empty/null', async () => {
      const isValid = await constraints.validate('');
      expect(mockService.findOne).not.toHaveBeenCalled();
      expect(isValid).toBe(false);
    });
    it('should return false if user service throw an error', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException());
      const invalidId = 'invalid-id';
      const isValid = await constraints.validate(invalidId);
      expect(mockService.findOne).toHaveBeenCalledWith(invalidId);
      expect(isValid).toBe(false);
    });
    it('should return false if user service return null', async () => {
      mockService.findOne.mockResolvedValue(null);
      const isValid = await constraints.validate(mockId);
      expect(mockService.findOne).toHaveBeenCalledWith(mockId);
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
