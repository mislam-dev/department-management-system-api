import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';

const mockActivityId = 'uuid-id';
const mockActivity: Partial<Activity> = {
  id: mockActivityId,
  activityType: 'notice',
  description: 'Desc',
  createdAt: new Date(),
  updatedAt: new Date(),
};
const mockActivityService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};
describe('ActivityController', () => {
  let controller: ActivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        {
          provide: ActivityService,
          useValue: mockActivityService,
        },
      ],
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an activity', async () => {
      const createDto: CreateActivityDto = {
        activityType: 'notice',
        description: 'desc',
      };
      mockActivityService.create.mockResolvedValue(mockActivity);

      const result = await controller.create(createDto);
      expect(mockActivityService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockActivity);
    });
  });

  describe('findAll', () => {
    it('should return activities', async () => {
      const query: FindAllQueryDto = { limit: 10, offset: 0 };
      const expected = {
        total: 1,
        limit: 10,
        offset: 0,
        results: [mockActivity],
      };
      mockActivityService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);
      expect(mockActivityService.findAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
      });
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a activity', async () => {
      mockActivityService.findOne.mockResolvedValue(mockActivity);
      const result = await controller.findOne(mockActivityId);

      expect(mockActivityService.findOne).toHaveBeenLastCalledWith(
        mockActivityId,
      );
      expect(result).toEqual(mockActivity);
    });

    it('should return a NotFoundException with invalid id', async () => {
      mockActivityService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a activity', async () => {
      const updateDto: UpdateActivityDto = { activityType: 'Updated' };
      const updated = { ...mockActivity, ...updateDto };

      mockActivityService.update.mockResolvedValue(updated);
      const result = await controller.update(mockActivityId, updateDto);
      expect(mockActivityService.update).toHaveBeenCalledWith(
        mockActivityId,
        updateDto,
      );
      expect(result).toEqual(updated);
    });
    it('should throw a NotFoundException if activity is not found', async () => {
      mockActivityService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update(mockActivityId, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('remove', () => {
    it('should remove a activity', async () => {
      mockActivityService.remove.mockResolvedValue({ affected: 1 });
      await controller.remove(mockActivityId);
      expect(mockActivityService.remove).toHaveBeenCalledWith(mockActivityId);
    });
    it('should throw a NotFoundException if activity is not found', async () => {
      mockActivityService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove(mockActivityId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
