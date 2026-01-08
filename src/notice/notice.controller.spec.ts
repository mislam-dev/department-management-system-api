import { Test, TestingModule } from '@nestjs/testing';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';

describe('NoticeController', () => {
  let controller: NoticeController;
  let service: any;

  const mockNotice = {
    id: 'notice-id',
    title: 'Title',
  };

  const mockNoticeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticeController],
      providers: [
        {
          provide: NoticeService,
          useValue: mockNoticeService,
        },
      ],
    }).compile();

    controller = module.get<NoticeController>(NoticeController);
    service = module.get<NoticeService>(NoticeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a notice', async () => {
      const createDto: CreateNoticeDto = {
        text: 'Title',
      };
      const user = {
        userId: 'user-id',
        email: 'email',
        auth0_sub: 'sub',
        auth0_role: 'role',
      };

      mockNoticeService.create.mockResolvedValue(mockNotice);

      const result = await controller.create(createDto, user);

      expect(service.create).toHaveBeenCalledWith({
        ...createDto,
        createdById: 'user-id',
      });
      expect(result).toEqual(mockNotice);
    });
  });

  describe('findAll', () => {
    it('should return a list of notices', async () => {
      const query: FindAllQueryDto = { limit: 10, offset: 0 };
      const expected = {
        total: 1,
        limit: 10,
        offset: 0,
        results: [mockNotice],
      };
      mockNoticeService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0 });
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a notice', async () => {
      mockNoticeService.findOne.mockResolvedValue(mockNotice);
      const result = await controller.findOne('notice-id');
      expect(service.findOne).toHaveBeenCalledWith('notice-id');
      expect(result).toEqual(mockNotice);
    });
  });

  describe('update', () => {
    it('should update a notice', async () => {
      const updateDto: UpdateNoticeDto = { text: 'Updated' };
      mockNoticeService.update.mockResolvedValue({
        ...mockNotice,
        ...updateDto,
      });
      const result = await controller.update('notice-id', updateDto);
      expect(service.update).toHaveBeenCalledWith('notice-id', updateDto);
      expect(result).toEqual({ ...mockNotice, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should remove a notice', async () => {
      mockNoticeService.remove.mockResolvedValue(undefined);
      await controller.remove('notice-id');
      expect(service.remove).toHaveBeenCalledWith('notice-id');
    });
  });
});
