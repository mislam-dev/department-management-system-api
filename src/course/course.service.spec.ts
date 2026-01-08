import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

describe('CourseService', () => {
  let service: CourseService;
  let repository: any;

  const mockCourse = {
    id: 'course-id',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    credit: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
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
        CourseService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
    repository = module.get(getRepositoryToken(Course));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCourseDto: CreateCourseDto = {
      name: 'Introduction to Computer Science',
      code: 'CS101',
      credit: 3,
    };

    it('should create a course', async () => {
      mockRepository.create.mockReturnValue(mockCourse);
      mockRepository.save.mockResolvedValue(mockCourse);

      const result = await service.create(createCourseDto);

      expect(repository.create).toHaveBeenCalledWith(createCourseDto);
      expect(repository.save).toHaveBeenCalledWith(mockCourse);
      expect(result).toEqual(mockCourse);
    });
  });

  describe('findAll', () => {
    it('should return a list of courses with pagination', async () => {
      const limit = 10;
      const offset = 0;
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([[mockCourse], total]);

      const result = await service.findAll({ limit, offset });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        take: limit,
        skip: offset,
      });
      expect(result).toEqual({
        total,
        limit,
        offset,
        results: [mockCourse],
      });
    });
  });

  describe('findOne', () => {
    it('should find a course by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockCourse);

      const result = await service.findOne('course-id');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'course-id' },
      });
      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException if course not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneBy', () => {
    it('should find a course by options', async () => {
      mockRepository.findOne.mockResolvedValue(mockCourse);

      const result = await service.findOneBy({ where: { code: 'CS101' } });

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { code: 'CS101' },
      });
      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException if course not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(
        service.findOneBy({ where: { code: 'INVALID' } }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateCourseDto: UpdateCourseDto = {
      name: 'Calculus',
    };

    it('should update a course', async () => {
      mockRepository.findOne.mockResolvedValue(mockCourse);
      const updatedCourse = { ...mockCourse, ...updateCourseDto };
      mockRepository.save.mockResolvedValue(updatedCourse);

      const result = await service.update('course-id', updateCourseDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'course-id' },
      });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateCourseDto),
      );
      expect(result).toEqual(updatedCourse);
    });

    it('should throw NotFoundException if course to update not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(
        service.update('invalid-id', updateCourseDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a course', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('course-id');

      expect(repository.delete).toHaveBeenCalledWith({ id: 'course-id' });
    });

    it('should throw NotFoundException if course to remove not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
