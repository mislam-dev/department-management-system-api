import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

describe('AttendanceController', () => {
  let controller: AttendanceController;
  let service: any;

  const mockAttendance = {
    id: 'attendance-id',
    status: 'present',
  };

  const mockAttendanceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

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
    service = module.get<AttendanceService>(AttendanceService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create attendance', async () => {
      const createDto: CreateAttendanceDto = {
        studentId: 'student-id',
        courseScheduleId: 'schedule-id',
        status: 'present',
      };
      mockAttendanceService.create.mockResolvedValue(mockAttendance);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockAttendance);
    });
  });

  describe('findAll', () => {
    it('should return attendance records', async () => {
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

      expect(service.findAll).toHaveBeenCalledWith(
        { limit: 10, offset: 0 },
        'student-id',
      );
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return attendance record', async () => {
      mockAttendanceService.findOne.mockResolvedValue(mockAttendance);
      const result = await controller.findOne('id');
      expect(service.findOne).toHaveBeenCalledWith('id');
      expect(result).toEqual(mockAttendance);
    });
  });

  describe('update', () => {
    it('should update attendance', async () => {
      const updateDto: UpdateAttendanceDto = { status: 'absent' };
      mockAttendanceService.update.mockResolvedValue({
        ...mockAttendance,
        ...updateDto,
      });
      const result = await controller.update('id', updateDto);
      expect(service.update).toHaveBeenCalledWith('id', updateDto);
      expect(result).toEqual({ ...mockAttendance, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should remove attendance', async () => {
      mockAttendanceService.remove.mockResolvedValue(undefined);
      await controller.remove('id');
      expect(service.remove).toHaveBeenCalledWith('id');
    });
  });
});
