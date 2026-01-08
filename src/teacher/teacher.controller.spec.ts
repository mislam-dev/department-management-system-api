import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { Designation } from 'src/user/entities/user.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';

describe('TeacherController', () => {
  let controller: TeacherController;
  let service: Record<string, jest.Mock>;

  const mockTeacher = {
    id: 'teacher-id',
    designation: Designation.INSTRUCTOR,
  };

  const mockTeacherService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [
        {
          provide: TeacherService,
          useValue: mockTeacherService,
        },
      ],
    }).compile();

    controller = module.get<TeacherController>(TeacherController);
    service = module.get<TeacherService>(TeacherService) as unknown as Record<
      string,
      jest.Mock
    >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a teacher', async () => {
      const createTeacherDto: CreateTeacherDto = {
        email: 'teacher@example.com',
        fullName: 'Teacher Name',
        password: 'password',
        joinDate: new Date().toISOString(),
        officeLocation: 'Room 101',
        designation: Designation.INSTRUCTOR,
      };
      mockTeacherService.create.mockResolvedValue(mockTeacher);

      const result = await controller.create(createTeacherDto);

      expect(service.create).toHaveBeenCalledWith(createTeacherDto);
      expect(result).toEqual(mockTeacher);
    });
  });

  describe('findAll', () => {
    it('should return a list of teachers', async () => {
      const paginationDto: PaginationDto = { limit: 10, offset: 0 };
      const expected = {
        total: 1,
        limit: 10,
        offset: 0,
        results: [mockTeacher],
      };
      mockTeacherService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(paginationDto);

      expect(service.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0 });
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a teacher', async () => {
      mockTeacherService.findOne.mockResolvedValue(mockTeacher);
      const result = await controller.findOne('teacher-id');
      expect(service.findOne).toHaveBeenCalledWith('teacher-id');
      expect(result).toEqual(mockTeacher);
    });
  });

  describe('update', () => {
    it('should update a teacher', async () => {
      const updateDto: UpdateTeacherDto = { officeLocation: 'Room 102' };
      mockTeacherService.update.mockResolvedValue({
        ...mockTeacher,
        ...updateDto,
      });
      const result = await controller.update('teacher-id', updateDto);
      expect(service.update).toHaveBeenCalledWith('teacher-id', updateDto);
      expect(result).toEqual({ ...mockTeacher, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should remove a teacher', async () => {
      mockTeacherService.remove.mockResolvedValue(undefined);
      await controller.remove('teacher-id');
      expect(service.remove).toHaveBeenCalledWith('teacher-id');
    });
  });
});
