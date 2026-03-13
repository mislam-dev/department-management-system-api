import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';
import { CourseService } from '../course.service';
import { IsCodeUniqueConstraints } from './is-code-unique.validator';

const mockCode = 'uuid-id';

const mockService = {
  findOneBy: jest.fn(),
};
describe('IsCodeUniqueConstraints', () => {
  let constraints: IsCodeUniqueConstraints;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IsCodeUniqueConstraints,
        {
          provide: CourseService,
          useValue: mockService,
        },
      ],
    }).compile();

    constraints = module.get(IsCodeUniqueConstraints);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(constraints).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if student is exist', async () => {
      mockService.findOneBy.mockResolvedValue({ id: mockCode });
      const isValid = await constraints.validate(mockCode);
      expect(mockService.findOneBy).toHaveBeenCalledWith({
        where: { code: mockCode },
      });
      expect(isValid).toBe(false);
    });
    it('should return false if student id is empty/null', async () => {
      const isValid = await constraints.validate('');
      expect(mockService.findOneBy).not.toHaveBeenCalled();
      expect(isValid).toBe(false);
    });
    it('should return false if course service throw an error', async () => {
      mockService.findOneBy.mockRejectedValue(new NotFoundException());
      const invalidCode = 'invalid-id';
      const isValid = await constraints.validate(invalidCode);
      expect(mockService.findOneBy).toHaveBeenCalledWith({
        where: { code: invalidCode },
      });
      expect(isValid).toBe(true);
    });
    it('should return false if course service return null', async () => {
      mockService.findOneBy.mockResolvedValue(null);
      const isValid = await constraints.validate(mockCode);
      expect(mockService.findOneBy).toHaveBeenCalledWith({
        where: { code: mockCode },
      });
      expect(isValid).toBe(true);
    });
  });

  describe('defaultMessage', () => {
    it('should return correct error message', () => {
      const data: ValidationArguments = {
        constraints: [],
        value: 'any',
        targetName: 'string',
        object: {},
        property: 'courseScheduleId',
      };
      const message = constraints.defaultMessage!(data);
      expect(message).toBe(`${data.property} is already exist!`);
    });
  });
});
