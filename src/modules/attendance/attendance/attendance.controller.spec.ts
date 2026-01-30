import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AttendanceStatus } from './entities/attendance.entity';

const mockId = 'attendance-id';
const mockAttendance = {
  id: mockId,
  status: 'present',
};

const mockAttendanceService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
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
describe('AttendanceController', () => {
  let controller: AttendanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        {
          provide: AttendanceService,
          useValue: mockAttendanceService,
        },
      ],
    }).compile();

    controller = module.get<AttendanceController>(AttendanceController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create attendance', async () => {
      mockAttendanceService.create.mockResolvedValue(mockAttendance);

      const result = await controller.create(createDto);

      expect(mockAttendanceService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockAttendance);
    });
  });

  describe('findAll', () => {
    it('should return attendance records with pagination', async () => {
      const query: FindAllQueryDto = {
        limit: 10,
        offset: 0,
        studentId: 'student-id',
      };
      const expected = {
        total: 1,
        limit: 10,
        offset: 0,
        results: [mockAttendance],
      };
      mockAttendanceService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(mockAttendanceService.findAll).toHaveBeenCalledWith(
        { limit: 10, offset: 0 },
        'student-id',
      );
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return attendance record', async () => {
      mockAttendanceService.findOne.mockResolvedValue(mockAttendance);
      const result = await controller.findOne(mockId);
      expect(mockAttendanceService.findOne).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockAttendance);
    });

    it('should throw NotFoundException if not found', async () => {
      mockAttendanceService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update attendance', async () => {
      const updated = {
        ...mockAttendance,
        ...updateDto,
      };
      mockAttendanceService.update.mockResolvedValue(updated);
      const result = await controller.update(mockId, updateDto);
      expect(mockAttendanceService.update).toHaveBeenCalledWith(
        mockId,
        updateDto,
      );
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should remove attendance', async () => {
      mockAttendanceService.remove.mockResolvedValue({ affected: 1 });
      await controller.remove(mockId);
      expect(mockAttendanceService.remove).toHaveBeenCalledWith(mockId);
    });
    it('should throw NotFoundException if not found', async () => {
      mockAttendanceService.remove.mockRejectedValue(new NotFoundException());
      await expect(controller.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
