import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

describe('CourseController', () => {
  let controller: CourseController;
  let service: any;

  const mockCourse = {
    id: 'course-id',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    credit: 3,
  };

  const mockCourseService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

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
    service = module.get<CourseService>(CourseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a course', async () => {
      const createCourseDto: CreateCourseDto = {
        name: 'Introduction to Computer Science',
        code: 'CS101',
        credit: 3,
      };
      mockCourseService.create.mockResolvedValue(mockCourse);

      const result = await controller.create(createCourseDto);

      expect(service.create).toHaveBeenCalledWith(createCourseDto);
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

      expect(service.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0 });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a course', async () => {
      mockCourseService.findOne.mockResolvedValue(mockCourse);

      const result = await controller.findOne('course-id');

      expect(service.findOne).toHaveBeenCalledWith('course-id');
      expect(result).toEqual(mockCourse);
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const updateCourseDto: UpdateCourseDto = { name: 'Calculus' };
      mockCourseService.update.mockResolvedValue({
        ...mockCourse,
        ...updateCourseDto,
      });

      const result = await controller.update('course-id', updateCourseDto);

      expect(service.update).toHaveBeenCalledWith('course-id', updateCourseDto);
      expect(result).toEqual({ ...mockCourse, ...updateCourseDto });
    });
  });

  describe('remove', () => {
    it('should remove a course', async () => {
      mockCourseService.remove.mockResolvedValue(undefined);

      await controller.remove('course-id');

      expect(service.remove).toHaveBeenCalledWith('course-id');
    });
  });
});
