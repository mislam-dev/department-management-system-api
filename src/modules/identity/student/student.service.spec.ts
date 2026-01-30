import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Designation } from 'src/modules/identity/user/entities/user.entity';
import { UserService } from 'src/modules/identity/user/user.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student, StudentStatus } from './entities/student.entity';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let repository: Record<string, jest.Mock>;
  let userService: Record<string, jest.Mock>;

  const mockStudent = {
    id: 'student-id',
    currentSemesterId: 'sem-id',
    enrolmentDate: new Date().toISOString(),
    graduationYear: 2024,
    session: '2020-24',
    status: StudentStatus.ACTIVE,
    userId: 'user-id',
  };

  const mockUser = {
    id: 'user-id',
    email: 'student@example.com',
    fullName: 'Student Name',
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(Student),
          useValue: mockRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    repository = module.get(getRepositoryToken(Student));
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
    const createStudentDto: CreateStudentDto = {
      email: 'student@example.com',
      fullName: 'Student Name',
      password: 'password',
      currentSemesterId: 'sem-id',
      enrolmentDate: new Date().toISOString(),
      graduationYear: 2024,
      session: '2020-24',
      status: StudentStatus.ACTIVE,
    };

    it('should create a student and user', async () => {
      mockUserService.create.mockResolvedValue(mockUser);
      mockRepository.create.mockReturnValue(mockStudent);
      mockRepository.save.mockResolvedValue(mockStudent);

      const result = await service.create(createStudentDto);

      expect(userService.create).toHaveBeenCalledWith({
        password: createStudentDto.password,
        designation: Designation.STUDENT,
        email: createStudentDto.email,
        fullName: createStudentDto.fullName,
      });
      expect(repository.create).toHaveBeenCalledWith({
        currentSemesterId: createStudentDto.currentSemesterId,
        enrolmentDate: createStudentDto.enrolmentDate,
        graduationYear: createStudentDto.graduationYear,
        session: createStudentDto.session,
        status: createStudentDto.status,
        userId: mockUser.id,
      });
      expect(repository.save).toHaveBeenCalledWith(mockStudent);
      expect(result).toEqual(mockStudent);
    });
  });

  describe('findAll', () => {
    it('should return a list of students', async () => {
      const limit = 10;
      const offset = 0;
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([[mockStudent], total]);

      const result = await service.findAll({ limit, offset });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: offset,
        take: limit,
      });
      expect(result).toEqual({
        total,
        limit,
        offset,
        results: [mockStudent],
      });
    });
  });

  describe('findOne', () => {
    it('should return a student', async () => {
      mockRepository.findOne.mockResolvedValue(mockStudent);

      const result = await service.findOne('student-id');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'student-id' },
      });
      expect(result).toEqual(mockStudent);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneByUserId', () => {
    it('should return a student by user id', async () => {
      mockRepository.findOne.mockResolvedValue(mockStudent);

      const result = await service.findOneByUserId('user-id');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-id' },
      });
      expect(result).toEqual(mockStudent);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneByUserId('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const updateStudentDto: UpdateStudentDto = { session: '2021-25' };
      mockRepository.findOne.mockResolvedValue(mockStudent);
      const updatedStudent = { ...mockStudent, ...updateStudentDto };
      mockRepository.save.mockResolvedValue(updatedStudent);

      const result = await service.update('student-id', updateStudentDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'student-id' },
      });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateStudentDto),
      );
      expect(result).toEqual(updatedStudent);
    });
  });

  describe('remove', () => {
    it('should delete a student', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('student-id');

      expect(repository.delete).toHaveBeenCalledWith({ id: 'student-id' });
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
