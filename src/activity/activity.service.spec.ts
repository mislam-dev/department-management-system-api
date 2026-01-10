import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';

describe('ActivityService', () => {
  let service: ActivityService;

  const mockActivityId = 'uuid-id';

  const mockActivity: Partial<Activity> = {
    id: mockActivityId,
    activityType: 'notice',
    description: 'Desc',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        {
          provide: getRepositoryToken(Activity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create activity', async () => {
      const createDto: CreateActivityDto = {
        activityType: 'notice',
        description: 'desc',
      };
      mockRepository.create.mockReturnValue(mockActivity);
      mockRepository.save.mockResolvedValue(mockActivity);

      const result = await service.create(createDto);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockActivity);
      expect(result).toEqual(mockActivity);
    });
  });

  describe('findAll', () => {
    it('should return an array of activities with pagination', async () => {
      const limit = 10;
      const offset = 0;
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([[mockActivity], total]);

      const result = await service.findAll({ limit, offset });
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: limit,
        skip: offset,
        order: { createdAt: 'desc' },
      });
      expect(result).toEqual({ total, limit, offset, results: [mockActivity] });
    });
  });

  describe('findOne', () => {
    it('should return activity', async () => {
      mockRepository.findOne.mockResolvedValue(mockActivity);
      const result = await service.findOne('id');
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'id' },
      });
      expect(result).toEqual(mockActivity);
    });

    it('should throw NotFoundException if activity not found', async () => {
      mockRepository.findOne.mockRejectedValue(new NotFoundException());
      await expect(service.findOne(mockActivityId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update activity', async () => {
      const updateDto: UpdateActivityDto = { activityType: 'Updated' };
      const updated = { ...mockActivity, ...updateDto };

      mockRepository.findOne.mockResolvedValue(mockActivity);
      mockRepository.save.mockResolvedValue(updated);

      const result = await service.update(mockActivityId, updateDto);

      expect(mockRepository.save).toHaveBeenCalledWith(updated);
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException if activity not found', async () => {
      mockRepository.findOne.mockRejectedValue(new NotFoundException());
      const updateDto: UpdateActivityDto = { activityType: 'Updated' };

      await expect(service.update(mockActivityId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove activity', async () => {
      mockRepository.findOne.mockResolvedValue(mockActivity);
      mockRepository.remove.mockResolvedValue(mockActivity);

      await service.remove(mockActivityId);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockActivity);
    });
    it('should throw NotFoundException if activity not found', async () => {
      mockRepository.findOne.mockRejectedValue(new NotFoundException());
      await expect(service.remove(mockActivityId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
