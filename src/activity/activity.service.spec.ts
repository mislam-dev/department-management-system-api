import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';

describe('ActivityService', () => {
  let service: ActivityService;
  let repository: any;

  const mockActivity = {
    id: 'activity-id',
    title: 'Activity',
    description: 'Desc',
    createdAt: new Date(),
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
    repository = module.get(getRepositoryToken(Activity));
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
        title: 'Activity',
        description: 'Desc',
      };
      mockRepository.create.mockReturnValue(mockActivity);
      mockRepository.save.mockResolvedValue(mockActivity);

      const result = await service.create(createDto);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockActivity);
      expect(result).toEqual(mockActivity);
    });
  });

  describe('findAll', () => {
    it('should return activities', async () => {
      const limit = 10;
      const offset = 0;
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([[mockActivity], total]);

      const result = await service.findAll({ limit, offset });
      expect(repository.findAndCount).toHaveBeenCalledWith({
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
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'id' } });
      expect(result).toEqual(mockActivity);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update activity', async () => {
      const updateDto: UpdateActivityDto = { title: 'Updated' };
      mockRepository.findOne.mockResolvedValue(mockActivity);
      const updated = { ...mockActivity, ...updateDto };
      mockRepository.save.mockResolvedValue(updated);

      const result = await service.update('id', updateDto);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove activity', async () => {
      mockRepository.findOne.mockResolvedValue(mockActivity);
      mockRepository.remove.mockResolvedValue(mockActivity);

      await service.remove('id');
      expect(repository.remove).toHaveBeenCalledWith(mockActivity);
    });
  });
});
