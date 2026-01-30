import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NoticeService } from 'src/modules/academic/notice/notice.service';
import { IsValidRelatedEntityIDConstraint } from './is-valid-related-entiy-id.validator';

const mockNoticeId = 'uuid-id';

const mockNoticeService = {
  findOne: jest.fn(),
};
describe('IsValidRelatedEntityIDConstraint', () => {
  let constraints: IsValidRelatedEntityIDConstraint;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        IsValidRelatedEntityIDConstraint,
        {
          provide: NoticeService,
          useValue: mockNoticeService,
        },
      ],
    }).compile();

    constraints = module.get(IsValidRelatedEntityIDConstraint);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(constraints).toBeDefined();
  });

  describe('validate', () => {
    it('should return true if relatedEntityId is exist', async () => {
      mockNoticeService.findOne.mockResolvedValue({ id: mockNoticeId });
      const isValid = await constraints.validate(mockNoticeId);
      expect(mockNoticeService.findOne).toHaveBeenCalledWith(mockNoticeId);
      expect(isValid).toBe(true);
    });
    it('should return false if relatedEntityId is empty/null', async () => {
      const isValid = await constraints.validate('');
      expect(mockNoticeService.findOne).not.toHaveBeenCalled();
      expect(isValid).toBe(false);
    });
    it('should return false if notice service throw an error', async () => {
      mockNoticeService.findOne.mockRejectedValue(new NotFoundException());
      const invalidId = 'invalid-id';
      const isValid = await constraints.validate(invalidId);
      expect(mockNoticeService.findOne).toHaveBeenCalledWith(invalidId);
      expect(isValid).toBe(false);
    });
    it('should return false if notice service return null', async () => {
      mockNoticeService.findOne.mockResolvedValue(null);
      const isValid = await constraints.validate(mockNoticeId);
      expect(mockNoticeService.findOne).toHaveBeenCalledWith(mockNoticeId);
      expect(isValid).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('should return correct error message', () => {
      const message = constraints.defaultMessage();
      expect(message).toBe('relatedEntityId must be valid!');
    });
  });
});
