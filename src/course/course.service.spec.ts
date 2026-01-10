import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

const mockId = 'course-id';

const mockCourse = {
  id: mockId,
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

const createCourseDto: CreateCourseDto = {
  name: 'Introduction to Computer Science',
  code: 'CS101',
  credits: 3,
  semesterId: 'semester-id',
};
const updateCourseDto: UpdateCourseDto = {
  name: 'Calculus',
};
describe('CourseService', () => {
  let service: CourseService;

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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a course', async () => {
      mockRepository.create.mockReturnValue(mockCourse);
      mockRepository.save.mockResolvedValue(mockCourse);

      const result = await service.create(createCourseDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createCourseDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCourse);
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

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
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

      const result = await service.findOne(mockId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockId },
      });
      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException if course not found', async () => {
      mockRepository.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneBy', () => {
    it('should find a course by options', async () => {
      mockRepository.findOne.mockResolvedValue(mockCourse);

      const result = await service.findOneBy({ where: { code: 'CS101' } });

      expect(mockRepository.findOne).toHaveBeenCalledWith({
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
    it('should update a course', async () => {
      mockRepository.findOne.mockResolvedValue(mockCourse);
      const updatedCourse = { ...mockCourse, ...updateCourseDto };
      mockRepository.save.mockResolvedValue(updatedCourse);

      const result = await service.update(mockId, updateCourseDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockId },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(
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

      await service.remove(mockId);

      expect(mockRepository.delete).toHaveBeenCalledWith({ id: mockId });
    });

    it('should throw NotFoundException if course to remove not found', async () => {
      mockRepository.delete.mockRejectedValue(new NotFoundException());

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
