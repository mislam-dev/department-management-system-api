import { Test, TestingModule } from '@nestjs/testing';
import { CreateStudentDto } from './dto/create-student.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentStatus } from './entities/student.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

describe('StudentController', () => {
  let controller: StudentController;
  let service: Record<string, jest.Mock>;

  const mockStudent = {
    id: 'student-id',
    session: '2020-24',
  };

  const mockStudentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    controller = module.get<StudentController>(StudentController);
    service = module.get<StudentService>(StudentService) as unknown as Record<
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
    it('should create a student', async () => {
      const createStudentDto: CreateStudentDto = {
        email: 'test@example.com',
        fullName: 'Test Student',
        password: 'pwd',
        currentSemesterId: 'sem-id',
        enrolmentDate: new Date().toISOString(),
        graduationYear: 2025,
        session: '2021-2025',
        status: StudentStatus.ACTIVE,
      };
      mockStudentService.create.mockResolvedValue(mockStudent);

      const result = await controller.create(createStudentDto);

      expect(service.create).toHaveBeenCalledWith(createStudentDto);
      expect(result).toEqual(mockStudent);
    });
  });

  describe('findAll', () => {
    it('should return a list of students', async () => {
      const paginationDto: PaginationDto = { limit: 10, offset: 0 };
      const expected = {
        total: 1,
        limit: 10,
        offset: 0,
        results: [mockStudent],
      };
      mockStudentService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(paginationDto);

      expect(service.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0 });
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a student', async () => {
      mockStudentService.findOne.mockResolvedValue(mockStudent);
      const result = await controller.findOne('student-id');
      expect(service.findOne).toHaveBeenCalledWith('student-id');
      expect(result).toEqual(mockStudent);
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const updateDto: UpdateStudentDto = { session: 'updated' };
      mockStudentService.update.mockResolvedValue({
        ...mockStudent,
        ...updateDto,
      });
      const result = await controller.update('student-id', updateDto);
      expect(service.update).toHaveBeenCalledWith('student-id', updateDto);
      expect(result).toEqual({ ...mockStudent, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should remove a student', async () => {
      mockStudentService.remove.mockResolvedValue(undefined);
      await controller.remove('student-id');
      expect(service.remove).toHaveBeenCalledWith('student-id');
    });
  });
});
