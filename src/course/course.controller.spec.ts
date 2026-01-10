import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

const mockId = 'course-id';
const mockCourse = {
  id: mockId,
  name: 'Introduction to Computer Science',
  code: 'CS101',
  credit: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
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
const mockCourseService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};
describe('CourseController', () => {
  let controller: CourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CourseService,
          useValue: mockCourseService,
        },
      ],
    }).compile();

    controller = module.get<CourseController>(CourseController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a course', async () => {
      mockCourseService.create.mockResolvedValue(mockCourse);

      const result = await controller.create(createCourseDto);

      expect(mockCourseService.create).toHaveBeenCalledWith(createCourseDto);
      expect(result).toEqual(mockCourse);
    });
  });

  describe('findAll', () => {
    it('should return a list of courses', async () => {
      const paginationDto: PaginationDto = { limit: 10, offset: 0 };
      const expectedResult = {
        total: 1,
        limit: 10,
        offset: 0,
        results: [mockCourse],
      };
      mockCourseService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(paginationDto);

      expect(mockCourseService.findAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a course', async () => {
      mockCourseService.findOne.mockResolvedValue(mockCourse);

      const result = await controller.findOne('course-id');

      expect(mockCourseService.findOne).toHaveBeenCalledWith('course-id');
      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException if course not found', async () => {
      mockCourseService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      mockCourseService.update.mockResolvedValue({
        ...mockCourse,
        ...updateCourseDto,
      });

      const result = await controller.update('course-id', updateCourseDto);

      expect(mockCourseService.update).toHaveBeenCalledWith(
        'course-id',
        updateCourseDto,
      );
      expect(result).toEqual({ ...mockCourse, ...updateCourseDto });
    });
    it('should throw NotFoundException if course not found', async () => {
      mockCourseService.findOne.mockRejectedValue(new NotFoundException());

      await controller.update('invalid-id', updateCourseDto);
      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCourseService.update).toHaveBeenCalledWith(
        'invalid-id',
        updateCourseDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a course', async () => {
      mockCourseService.remove.mockResolvedValue(undefined);

      await controller.remove('course-id');

      expect(mockCourseService.remove).toHaveBeenCalledWith('course-id');
    });
  });
});
