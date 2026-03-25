import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTeacherUnavailabilityDto } from './dto/create-teacher_unavailability.dto';
import { UpdateTeacherUnavailabilityDto } from './dto/update-teacher_unavailability.dto';
import { TeacherUnavailability } from './entities/teacher_unavailability.entity';
import { TeacherUnavailabilityService } from './teacher_unavailability.service';

describe('TeacherUnavailabilityService', () => {
  let service: TeacherUnavailabilityService;
  let repository: Record<string, jest.Mock>;

  const mockData = {
    id: 'id',
    teacherId: 'teacher-id',
    reason: 'Sick',
    startDatetime: new Date().toISOString(),
    endDatetime: new Date().toISOString(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherUnavailabilityService,
        {
          provide: getRepositoryToken(TeacherUnavailability),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TeacherUnavailabilityService>(
      TeacherUnavailabilityService,
    );
    repository = module.get(getRepositoryToken(TeacherUnavailability));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create data', async () => {
      const createDto: CreateTeacherUnavailabilityDto & { teacherId: string } =
        {
          reason: 'Sick',
          startDatetime: new Date().toISOString(),
          endDatetime: new Date().toISOString(),
          teacherId: 'teacher-id',
        };

      mockRepository.create.mockReturnValue(mockData);
      mockRepository.save.mockResolvedValue(mockData);

      const result = await service.create(createDto);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockData);
      expect(result).toEqual(mockData);
    });
  });

  describe('findAll', () => {
    it('should return data', async () => {
      const limit = 10;
      const offset = 0;
      const teacherId = 'teacher-id';
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([[mockData], total]);

      const result = await service.findAll({ limit, offset, teacherId });
      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { teacherId },
        take: limit,
        skip: offset,
        order: { createdAt: 'desc' },
      });
      expect(result).toEqual({ total, limit, offset, results: [mockData] });
    });
  });

  describe('findOne', () => {
    it('should return data', async () => {
      mockRepository.findOne.mockResolvedValue(mockData);
      const result = await service.findOne('id');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'id' } });
      expect(result).toEqual(mockData);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update data', async () => {
      const updateDto: UpdateTeacherUnavailabilityDto = { reason: 'Updated' };
      mockRepository.findOne.mockResolvedValue(mockData);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      await service.update('id', updateDto);

      expect(repository.update).toHaveBeenCalledWith(
        'id',
        expect.objectContaining(updateDto),
      );
    });
  });

  describe('remove', () => {
    it('should remove data', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      await service.remove('id');
      expect(repository.delete).toHaveBeenCalledWith({ id: 'id' });
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('id')).rejects.toThrow(NotFoundException);
    });
  });
});
