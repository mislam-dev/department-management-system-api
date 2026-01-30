import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Semester } from './entities/semester.entity';
import { SemesterService } from './semester.service';

const mockSemesterId = 'uuid-123';
const mockSemester: Semester = {
  id: mockSemesterId,
  name: 'Fall 2023',
  students: [],
};

const mockSemesterRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

const mockCreateDto = { name: 'Fall 2023' };
const mockUpdateDto = { name: 'Spring 2024' };

describe('SemesterService', () => {
  let service: SemesterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SemesterService,
        {
          provide: getRepositoryToken(Semester),
          useValue: mockSemesterRepository,
        },
      ],
    }).compile();

    service = module.get<SemesterService>(SemesterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return semester', async () => {
      mockSemesterRepository.create.mockReturnValue(mockSemester);
      mockSemesterRepository.save.mockReturnValue(mockSemester);

      const result = await service.create(mockCreateDto);

      expect(mockSemesterRepository.create).toHaveBeenCalledWith(mockCreateDto);
      expect(mockSemesterRepository.save).toHaveBeenCalledWith(mockSemester);
      expect(result).toEqual(mockSemester);
    });
  });
  describe('findAll', () => {
    it('should return an array of semesters', async () => {
      const semesters = [mockSemester];
      mockSemesterRepository.find.mockResolvedValue(semesters);

      const result = await service.findAll();

      expect(mockSemesterRepository.find).toHaveBeenCalled();
      expect(result).toEqual(semesters);
    });
  });

  describe('findOne', () => {
    it('should return a semester by id', async () => {
      mockSemesterRepository.findOne.mockResolvedValue(mockSemester);
      const result = await service.findOne(mockSemesterId);

      expect(mockSemesterRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockSemesterId },
      });
      expect(result).toEqual(mockSemester);
    });

    it('should throw NotFoundException if semester is not found', async () => {
      mockSemesterRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return the semester', async () => {
      mockSemesterRepository.findOne.mockResolvedValue(mockSemester);
      const updatedSemester = { ...mockSemester, ...mockUpdateDto };
      const result = await service.update(mockSemesterId, updatedSemester);
      expect(mockSemesterRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockSemesterId },
      });
      expect(mockSemesterRepository.save).toHaveBeenLastCalledWith(
        expect.objectContaining(mockUpdateDto),
      );
      expect(result.name).toEqual(mockUpdateDto.name);
    });
    it('should throw NotFoundException if semester to update does not exist', async () => {
      mockSemesterRepository.findOne.mockResolvedValue(null);
      await expect(service.update('invalid-id', mockUpdateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockSemesterRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove delete the semester if it exist', async () => {
      mockSemesterRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(mockSemesterId);
      expect(mockSemesterRepository.delete).toHaveBeenCalledWith(
        mockSemesterId,
      );
    });
    it('should throw NotFoundException if semester is not found', async () => {
      mockSemesterRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
