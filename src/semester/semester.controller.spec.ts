import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { Semester } from './entities/semester.entity';
import { SemesterController } from './semester.controller';
import { SemesterService } from './semester.service';

const mockSemesterId = 'uuid-123';
const mockSemester: Semester = {
  id: mockSemesterId,
  name: 'Fall 2023',
  students: [],
};

const mockSemesterService = {
  findAll: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockCreateDto: CreateSemesterDto = { name: 'Fall 2023' };
const mockUpdateDto: UpdateSemesterDto = { name: 'Spring 2024' };

describe('SemesterController', () => {
  let controller: SemesterController;
  let service: SemesterService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [SemesterController],
      providers: [
        {
          provide: SemesterService,
          useValue: mockSemesterService,
        },
      ],
    }).compile();
    service = module.get<SemesterService>(SemesterService);
    controller = module.get<SemesterController>(SemesterController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should create a semester', async () => {
      mockSemesterService.create.mockResolvedValue(mockSemester);

      const result = await controller.create(mockCreateDto);

      expect(mockSemesterService.create).toHaveBeenCalledWith(mockCreateDto);
      expect(result).toEqual(mockSemester);
    });
  });
  describe('findAll', () => {
    it('should return an array of semester', async () => {
      const resultArr = [mockSemester];
      mockSemesterService.findAll.mockResolvedValue(resultArr);

      const result = await controller.findAll();
      expect(mockSemesterService.findAll).toHaveBeenCalled();
      expect(result).toEqual(resultArr);
    });
  });
  describe('findOne', () => {
    it('should return a semester', async () => {
      mockSemesterService.findOne.mockResolvedValue(mockSemester);
      const result = await controller.findOne(mockSemesterId);

      expect(mockSemesterService.findOne).toHaveBeenLastCalledWith(
        mockSemesterId,
      );
      expect(result).toEqual(mockSemester);
    });

    it('should return a NotFoundException with invalid id', async () => {
      mockSemesterService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('update', () => {
    it('should update a semester', async () => {
      const updated_semester = { ...mockSemester, ...mockUpdateDto };
      mockSemesterService.update.mockResolvedValue(updated_semester);
      const result = await controller.update(mockSemesterId, mockUpdateDto);
      expect(mockSemesterService.update).toHaveBeenCalledWith(
        mockSemesterId,
        mockUpdateDto,
      );
      expect(result).toEqual(updated_semester);
    });
    it('should throw a NotFoundException if semester is not found', async () => {
      mockSemesterService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update(mockSemesterId, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('remove', () => {
    it('should remove a semester', async () => {
      mockSemesterService.remove.mockResolvedValue({ affected: 1 });
      const result = await controller.remove(mockSemesterId);
      expect(mockSemesterService.remove).toHaveBeenCalledWith(mockSemesterId);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
