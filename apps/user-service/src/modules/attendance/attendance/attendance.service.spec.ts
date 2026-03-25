import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';

const mockId = 'attendance-id';

const mockAttendance = {
  id: mockId,
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
const createDto: CreateAttendanceDto = {
  studentId: 'student-id',
  courseScheduleId: 'schedule-id',
  status: AttendanceStatus.PRESENT,
  date: new Date().toString(),
};
const updateDto: UpdateAttendanceDto = {
  status: AttendanceStatus.ABSENT,
};
describe('AttendanceService', () => {
  let service: AttendanceService;

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create attendance', async () => {
      mockRepository.create.mockReturnValue(mockAttendance);
      mockRepository.save.mockResolvedValue(mockAttendance);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockAttendance);
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

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
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
      const result = await service.findOne(mockId);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockId },
      });
      expect(result).toEqual(mockAttendance);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOne.mockRejectedValue(new NotFoundException());
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update attendance', async () => {
      mockRepository.findOne.mockResolvedValue(mockAttendance);
      const updatedDiff = { ...mockAttendance, ...updateDto };
      mockRepository.save.mockResolvedValue(updatedDiff);

      const result = await service.update(mockId, updateDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockId },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
      expect(result).toEqual(updatedDiff);
    });

    it('should throw NotFoundException if activity not found', async () => {
      mockRepository.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.update(mockId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove attendance', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });
      await service.remove(mockId);
      expect(mockRepository.delete).toHaveBeenCalledWith({ id: mockId });
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
