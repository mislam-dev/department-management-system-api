import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTeacherAttendanceDto } from './dto/create-teacher-attendance.dto';
import { UpdateTeacherAttendanceDto } from './dto/update-teacher-attendance.dto';
import {
  AttendanceStatus,
  TeacherAttendance,
} from './entities/teacher-attendance.entity';
import { TeacherAttendanceService } from './teacher-attendance.service';

describe('TeacherAttendanceService', () => {
  let service: TeacherAttendanceService;
  let repository: Record<string, jest.Mock>;

  const mockAttendance = {
    id: 'id',
    teacherId: 'teacher-id',
    recordedById: 'user-id',
    status: AttendanceStatus.PRESENT,
    date: new Date(),
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
        TeacherAttendanceService,
        {
          provide: getRepositoryToken(TeacherAttendance),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TeacherAttendanceService>(TeacherAttendanceService);
    repository = module.get(getRepositoryToken(TeacherAttendance));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create attendance', async () => {
      const createDto: CreateTeacherAttendanceDto & {
        teacherId: string;
        recordedById: string;
      } = {
        status: AttendanceStatus.PRESENT,
        teacherId: 'teacher-id',
        recordedById: 'user-id',
      };

      mockRepository.create.mockReturnValue(mockAttendance);
      mockRepository.save.mockResolvedValue(mockAttendance);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockAttendance);
      expect(result).toEqual(mockAttendance);
    });
  });

  describe('findAll', () => {
    it('should return attendance records', async () => {
      const limit = 10;
      const offset = 0;
      const teacherId = 'teacher-id';
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([[mockAttendance], total]);

      const result = await service.findAll({ limit, offset, teacherId });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        take: limit,
        skip: offset,
        where: { teacherId },
      });
      expect(result).toEqual({
        total,
        limit,
        offset,
        results: [mockAttendance],
      });
    });
  });

  describe('findOne', () => {
    it('should return attendance', async () => {
      mockRepository.findOne.mockResolvedValue(mockAttendance);
      const result = await service.findOne('id');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'id' } });
      expect(result).toEqual(mockAttendance);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update attendance', async () => {
      const updateDto: UpdateTeacherAttendanceDto = {
        status: AttendanceStatus.ON_LEAVE,
      };
      mockRepository.findOne.mockResolvedValue(mockAttendance);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      await service.update('id', updateDto);

      expect(repository.update).toHaveBeenCalledWith(
        { id: 'id' },
        expect.objectContaining(updateDto),
      );
    });
  });

  describe('remove', () => {
    it('should remove attendance', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      await service.remove('id');
      expect(repository.delete).toHaveBeenCalledWith('id');
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('id')).rejects.toThrow(NotFoundException);
    });
  });
});
