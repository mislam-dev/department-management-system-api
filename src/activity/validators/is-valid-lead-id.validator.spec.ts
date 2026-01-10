import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { IsValidLeadIDConstraint } from './is-valid-lead-id.validator';

const mockStudentId = 'uuid-id';

const mockUserService = {
  findOne: jest.fn(),
};
describe('IsValidLeadIDConstraint', () => {
  let constraints: IsValidLeadIDConstraint;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IsValidLeadIDConstraint,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    constraints = module.get(IsValidLeadIDConstraint);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(constraints).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if student is exist', async () => {
      mockUserService.findOne.mockResolvedValue({ id: mockStudentId });
      const isValid = await constraints.validate(mockStudentId);
      expect(mockUserService.findOne).toHaveBeenCalledWith(mockStudentId);
      expect(isValid).toBe(true);
    });
    it('should return false if student id is empty/null', async () => {
      const isValid = await constraints.validate('');
      expect(mockUserService.findOne).not.toHaveBeenCalled();
      expect(isValid).toBe(false);
    });
    it('should return false if user service throw an error', async () => {
      mockUserService.findOne.mockRejectedValue(new NotFoundException());
      const invalidId = 'invalid-id';
      const isValid = await constraints.validate(invalidId);
      expect(mockUserService.findOne).toHaveBeenCalledWith(invalidId);
      expect(isValid).toBe(false);
    });
    it('should return false if user service return null', async () => {
      mockUserService.findOne.mockResolvedValue(null);
      const isValid = await constraints.validate(mockStudentId);
      expect(mockUserService.findOne).toHaveBeenCalledWith(mockStudentId);
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
