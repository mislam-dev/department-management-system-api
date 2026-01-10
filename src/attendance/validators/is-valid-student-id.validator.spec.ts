import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { StudentService } from 'src/student/student.service';
import { IsValidStudentIDConstraint } from './is-valid-student-id.validator';

const mockStudentId = 'uuid-id';

const mockStudentService = {
  findOne: jest.fn(),
};
describe('IsValidStudentIDConstraint', () => {
  let constraints: IsValidStudentIDConstraint;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IsValidStudentIDConstraint,
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    constraints = module.get(IsValidStudentIDConstraint);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(constraints).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if student is exist', async () => {
      mockStudentService.findOne.mockResolvedValue({ id: mockStudentId });
      const isValid = await constraints.validate(mockStudentId);
      expect(mockStudentService.findOne).toHaveBeenCalledWith(mockStudentId);
      expect(isValid).toBe(true);
    });
    it('should return false if student id is empty/null', async () => {
      const isValid = await constraints.validate('');
      expect(mockStudentService.findOne).not.toHaveBeenCalled();
      expect(isValid).toBe(false);
    });
    it('should return false if user service throw an error', async () => {
      mockStudentService.findOne.mockRejectedValue(new NotFoundException());
      const invalidId = 'invalid-id';
      const isValid = await constraints.validate(invalidId);
      expect(mockStudentService.findOne).toHaveBeenCalledWith(invalidId);
      expect(isValid).toBe(false);
    });
    it('should return false if user service return null', async () => {
      mockStudentService.findOne.mockResolvedValue(null);
      const isValid = await constraints.validate(mockStudentId);
      expect(mockStudentService.findOne).toHaveBeenCalledWith(mockStudentId);
      expect(isValid).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return correct error message', () => {
      const message = constraints.defaultMessage();
      expect(message).toBe('studentId must be valid!');
    });
  });
});
