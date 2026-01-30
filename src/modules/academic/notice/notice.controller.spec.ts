import { Test, TestingModule } from '@nestjs/testing';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';

const mockNotice = {
  id: 'notice-id',
  title: 'Notice Title',
  content: 'Notice Content',
  createdById: 'user-id',
  createdAt: new Date(),
};

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};
const createDto: CreateNoticeDto & { createdById: string } = {
  text: 'text',
  createdById: 'user-id',
};
const updateDto: UpdateNoticeDto = { text: 'Updated Title' };

describe('NoticeController', () => {
  let controller: NoticeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticeController],
      providers: [
        {
          provide: NoticeService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<NoticeController>(NoticeController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a notice', async () => {
      const user = {
        userId: 'user-id',
        email: 'email',
        auth0_sub: 'sub',
        auth0_role: 'role',
        iss: 'String',
        sub: 'string',
        aud: [],
        iat: 1,
        exp: 1,
        scope: 'string',
        azp: 'string',
        permissions: [],
      };

      mockService.create.mockResolvedValue(mockNotice);

      const result = await controller.create(createDto, user);

      expect(mockService.create).toHaveBeenCalledWith({
        ...createDto,
        createdById: user.userId,
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
      mockService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(query);

      expect(mockService.findAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
      });
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a notice', async () => {
      mockService.findOne.mockResolvedValue(mockNotice);
      const result = await controller.findOne('notice-id');
      expect(mockService.findOne).toHaveBeenCalledWith('notice-id');
      expect(result).toEqual(mockNotice);
    });
  });

  describe('update', () => {
    it('should update a notice', async () => {
      mockService.update.mockResolvedValue({
        ...mockNotice,
        ...updateDto,
      });
      const result = await controller.update('notice-id', updateDto);
      expect(mockService.update).toHaveBeenCalledWith('notice-id', updateDto);
      expect(result).toEqual({ ...mockNotice, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should remove a notice', async () => {
      mockService.remove.mockResolvedValue(undefined);
      await controller.remove('notice-id');
      expect(mockService.remove).toHaveBeenCalledWith('notice-id');
    });
  });
});
