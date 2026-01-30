import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Designation } from 'src/modules/identity/user/entities/user.entity';
import { UserService } from 'src/modules/identity/user/user.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { TeacherService } from './teacher.service';

describe('TeacherService', () => {
  let service: TeacherService;
  let repository: Record<string, jest.Mock>;
  let userService: Record<string, jest.Mock>;

  const mockTeacher = {
    id: 'teacher-id',
    userId: 'user-id',
    joinDate: new Date(),
    officeLocation: 'Room 101',
    designation: Designation.INSTRUCTOR,
  };

  const mockUser = {
    id: 'user-id',
    email: 'teacher@example.com',
    fullName: 'Teacher Name',
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        {
          provide: getRepositoryToken(Teacher),
          useValue: mockRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
    repository = module.get(getRepositoryToken(Teacher));
    userService = module.get<UserService>(UserService) as unknown as Record<
      string,
      jest.Mock
    >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTeacherDto: CreateTeacherDto = {
      email: 'teacher@example.com',
      fullName: 'Teacher Name',
      password: 'password',
      joinDate: new Date().toISOString(),
      officeLocation: 'Room 101',
      designation: Designation.INSTRUCTOR,
    };

    it('should create a teacher and user', async () => {
      mockUserService.create.mockResolvedValue(mockUser);
      mockRepository.create.mockReturnValue(mockTeacher);
      mockRepository.save.mockResolvedValue(mockTeacher);

      const result = await service.create(createTeacherDto);

      expect(userService.create).toHaveBeenCalledWith({
        password: createTeacherDto.password,
        designation: createTeacherDto.designation,
        email: createTeacherDto.email,
        fullName: createTeacherDto.fullName,
      });
      expect(repository.create).toHaveBeenCalledWith({
        userId: mockUser.id,
        joinDate: createTeacherDto.joinDate,
        officeLocation: createTeacherDto.officeLocation,
        designation: createTeacherDto.designation,
      });
      expect(repository.save).toHaveBeenCalledWith(mockTeacher);
      expect(result).toEqual(mockTeacher);
    });
  });

  describe('findAll', () => {
    it('should return a list of teachers', async () => {
      const limit = 10;
      const offset = 0;
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([[mockTeacher], total]);

      const result = await service.findAll({ limit, offset });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        take: limit,
        skip: offset,
      });
      expect(result).toEqual({
        total,
        limit,
        offset,
        results: [mockTeacher],
      });
    });
  });

  describe('findOne', () => {
    it('should return a teacher', async () => {
      mockRepository.findOne.mockResolvedValue(mockTeacher);

      const result = await service.findOne('teacher-id');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'teacher-id' },
      });
      expect(result).toEqual(mockTeacher);
    });

    it('should throw NotFoundException if teacher not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneByUserId', () => {
    it('should return a teacher by user id', async () => {
      mockRepository.findOne.mockResolvedValue(mockTeacher);

      const result = await service.findOneByUserId('user-id');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-id' },
      });
      expect(result).toEqual(mockTeacher);
    });

    it('should throw NotFoundException if teacher not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneByUserId('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a teacher', async () => {
      const updateTeacherDto: UpdateTeacherDto = { officeLocation: 'Room 102' };
      mockRepository.findOne.mockResolvedValue(mockTeacher);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      // Since object.assign mutates the object, let's create a copy or rely on object mutation
      // The service implementation mutates the retrieved object and then calls update with it.
      // Actually the service does: Object.assign(teacher, updateTeacherDto); return this.repo.update({ id }, teacher);

      // Wait, repo.update usually returns UpdateResult, not the entity.
      // The current implementation in service returns whatever repo.update returns.
      // Let's verify service implementation: return this.repo.update({ id }, teacher);

      const result = await service.update('teacher-id', updateTeacherDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'teacher-id' },
      });
      expect(repository.update).toHaveBeenCalledWith(
        { id: 'teacher-id' },
        expect.objectContaining(updateTeacherDto),
      );
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if teacher to update not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.update('id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a teacher', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('teacher-id');

      expect(repository.delete).toHaveBeenCalledWith('teacher-id');
    });

    it('should throw NotFoundException if teacher to remove not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('id')).rejects.toThrow(NotFoundException);
    });
  });
});
