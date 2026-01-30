import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';
import { SemesterService } from '../semester.service';
import { IsValidSemesterIdConstraints } from './is-valid-semester-id.validator';

const mockSemesterId = 'uuid-123';
const mockSemesterService = {
  findAll: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};
describe('IsValidSemesterIdConstraints', () => {
  let constraints: IsValidSemesterIdConstraints;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IsValidSemesterIdConstraints,
        {
          provide: SemesterService,
          useValue: mockSemesterService,
        },
      ],
    }).compile();

    constraints = module.get(IsValidSemesterIdConstraints);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(constraints).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if semester is exist', async () => {
      mockSemesterService.findOne.mockResolvedValue({ id: mockSemesterId });
      const isValid = await constraints.validate(mockSemesterId);
      expect(mockSemesterService.findOne).toHaveBeenCalledWith(mockSemesterId);
      expect(isValid).toBe(true);
    });
    it('should return false if semester id is empty/null', async () => {
      const isValid = await constraints.validate('');
      expect(mockSemesterService.findOne).not.toHaveBeenCalled();
      expect(isValid).toBe(false);
    });
    it('should return false if semester service throw an error', async () => {
      mockSemesterService.findOne.mockRejectedValue(new NotFoundException());
      const invalidId = 'invalid-id';
      const isValid = await constraints.validate(invalidId);
      expect(mockSemesterService.findOne).toHaveBeenCalledWith(invalidId);
      expect(isValid).toBe(false);
    });
    it('should return false if semester service return null', async () => {
      mockSemesterService.findOne.mockResolvedValue(null);
      const isValid = await constraints.validate(mockSemesterId);
      expect(mockSemesterService.findOne).toHaveBeenCalledWith(mockSemesterId);
      expect(isValid).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return correct error message', () => {
      const mockArgs: ValidationArguments = {
        property: 'semesterId',
        value: 'invalid-id',
        targetName: 'StudentDto',
        object: {},
        constraints: [],
      };
      const message = constraints.defaultMessage!(mockArgs);
      expect(message).toBe('semesterId must be a valid semester id');
    });
  });
});
