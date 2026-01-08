import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Notice } from './entities/notice.entity';
import { NoticeService } from './notice.service';

describe('NoticeService', () => {
  let service: NoticeService;
  let repository: any;

  const mockNotice = {
    id: 'notice-id',
    title: 'Notice Title',
    content: 'Notice Content',
    createdById: 'user-id',
    createdAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NoticeService,
        {
          provide: getRepositoryToken(Notice),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NoticeService>(NoticeService);
    repository = module.get(getRepositoryToken(Notice));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notice', async () => {
      const createDto: CreateNoticeDto & { createdById: string } = {
        text: 'text',
        createdById: 'user-id',
      };

      mockRepository.create.mockReturnValue(mockNotice);
      mockRepository.save.mockResolvedValue(mockNotice);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockNotice);
      expect(result).toEqual(mockNotice);
    });
  });

  describe('findAll', () => {
    it('should return a list of notices', async () => {
      const limit = 10;
      const offset = 0;
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([[mockNotice], total]);

      const result = await service.findAll({ limit, offset });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: offset,
        take: limit,
        order: { createdAt: 'desc' },
      });
      expect(result).toEqual({ total, limit, offset, results: [mockNotice] });
    });
  });

  describe('findOne', () => {
    it('should return a notice', async () => {
      mockRepository.findOne.mockResolvedValue(mockNotice);
      const result = await service.findOne('notice-id');
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'notice-id' },
      });
      expect(result).toEqual(mockNotice);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a notice', async () => {
      const updateDto: UpdateNoticeDto = { text: 'Updated Title' };
      mockRepository.findOne.mockResolvedValue(mockNotice);
      const updatedNotice = { ...mockNotice, ...updateDto };
      mockRepository.save.mockResolvedValue(updatedNotice);

      const result = await service.update('notice-id', updateDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'notice-id' },
      });
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
      expect(result).toEqual(updatedNotice);
    });
  });

  describe('remove', () => {
    it('should remove a notice', async () => {
      mockRepository.findOne.mockResolvedValue(mockNotice);
      mockRepository.remove.mockResolvedValue(mockNotice);

      await service.remove('notice-id');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'notice-id' },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockNotice);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.remove('id')).rejects.toThrow(NotFoundException);
    });
  });
});
