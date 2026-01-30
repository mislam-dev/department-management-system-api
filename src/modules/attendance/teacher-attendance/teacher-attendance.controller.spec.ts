import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { UserPayload } from 'src/core/authentication/auth/decorators/user.decorator';
import { CreateTeacherAttendanceDto } from './dto/create-teacher-attendance.dto';
import { UpdateTeacherAttendanceDto } from './dto/update-teacher-attendance.dto';
import { AttendanceStatus } from './entities/teacher-attendance.entity';
import { TeacherAttendanceController } from './teacher-attendance.controller';
import { TeacherAttendanceService } from './teacher-attendance.service';

describe('TeacherAttendanceController', () => {
  let controller: TeacherAttendanceController;
  let service: Record<string, jest.Mock>;

  const mockAttendance = {
    id: 'id',
    status: AttendanceStatus.PRESENT,
  };

  const mockTeacherAttendanceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherAttendanceController],
      providers: [
        {
          provide: TeacherAttendanceService,
          useValue: mockTeacherAttendanceService,
        },
      ],
    }).compile();

    controller = module.get<TeacherAttendanceController>(
      TeacherAttendanceController,
    );
    service = module.get<TeacherAttendanceService>(
      TeacherAttendanceService,
    ) as unknown as Record<string, jest.Mock>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create attendance', async () => {
      const createDto: CreateTeacherAttendanceDto = {
        status: AttendanceStatus.PRESENT,
      };
      const user = {
        userId: 'user-id',
        email: 'email',
        auth0_sub: 'sub',
        auth0_role: 'role',
      } as unknown as UserPayload;
      const teacherId = 'teacher-id';

      mockTeacherAttendanceService.create.mockResolvedValue(mockAttendance);

      const result = await controller.create(createDto, teacherId, user);

      expect(service.create).toHaveBeenCalledWith({
        ...createDto,
        teacherId,
        recordedById: 'user-id',
      });
      expect(result).toEqual(mockAttendance);
    });
  });

  describe('findAll', () => {
    it('should return attendance records', async () => {
      const pagination: PaginationDto = { limit: 10, offset: 0 };
      const teacherId = 'teacher-id';
      const expected = {
        total: 1,
        limit: 10,
        offset: 0,
        results: [mockAttendance],
      };
      mockTeacherAttendanceService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(teacherId, pagination);

      expect(service.findAll).toHaveBeenCalledWith({
        teacherId,
        ...pagination,
      });
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return attendance', async () => {
      mockTeacherAttendanceService.findOne.mockResolvedValue(mockAttendance);
      const result = await controller.findOne('id');
      expect(service.findOne).toHaveBeenCalledWith('id');
      expect(result).toEqual(mockAttendance);
    });
  });

  describe('update', () => {
    it('should update attendance', async () => {
      const updateDto: UpdateTeacherAttendanceDto = {
        status: AttendanceStatus.ON_LEAVE,
      };
      mockTeacherAttendanceService.update.mockResolvedValue({
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
      mockTeacherAttendanceService.remove.mockResolvedValue(undefined);
      await controller.remove('id');
      expect(service.remove).toHaveBeenCalledWith('id');
    });
  });
});
