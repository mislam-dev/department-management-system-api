import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

describe('AttendanceService', () => {
  let service: AttendanceService;
  let repository: any;

  const mockAttendance = {
    id: 'attendance-id',
    studentId: 'student-id',
    courseScheduleId: 'schedule-id',
    status: 'present',
    date: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        {
          provide: getRepositoryToken(Attendance),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
    repository = module.get(getRepositoryToken(Attendance));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create attendance', async () => {
      const createDto: CreateAttendanceDto = {
        studentId: 'student-id',
        courseScheduleId: 'schedule-id',
        status: 'present',
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
      const studentId = 'student-id';
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([[mockAttendance], total]);

      const result = await service.findAll({ limit, offset }, studentId);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: offset,
        take: limit,
        where: { studentId },
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
    it('should return an attendance record', async () => {
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
      const updateDto: UpdateAttendanceDto = { status: 'absent' };
      mockRepository.findOne.mockResolvedValue(mockAttendance);
      const updatedDiff = { ...mockAttendance, ...updateDto };
      mockRepository.save.mockResolvedValue(updatedDiff);

      const result = await service.update('id', updateDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 'id' } });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
      expect(result).toEqual(updatedDiff);
    });
  });

  describe('remove', () => {
    it('should remove attendance', async () => {
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
