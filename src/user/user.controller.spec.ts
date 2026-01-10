import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: Record<string, jest.Mock>;

  const mockUser = {
    id: 'user-id',
    fullName: 'Test User',
    email: 'test@example.com',
  };

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService) as unknown as Record<
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
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        fullName: 'Test User',
        email: 'test@example.com',
        designation: 'student',
        password: 'password',
      };
      mockUserService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const paginationDto: PaginationDto = { limit: 10, offset: 0 };
      const expectedResult = {
        total: 1,
        limit: 10,
        offset: 0,
        results: [mockUser],
      };
      mockUserService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(paginationDto);

      expect(service.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0 });
      expect(result).toEqual(expectedResult);
    });

    it('should use default pagination values', async () => {
      const paginationDto: PaginationDto = { limit: 10, offset: 0 };
      const expectedResult = {
        total: 1,
        limit: 10,
        offset: 0,
        results: [mockUser],
      };
      mockUserService.findAll.mockResolvedValue(expectedResult);

      await controller.findAll(paginationDto);

      expect(service.findAll).toHaveBeenCalledWith({ limit: 10, offset: 0 });
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('user-id');

      expect(service.findOne).toHaveBeenCalledWith('user-id');
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { fullName: 'Updated' };
      mockUserService.update.mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      const result = await controller.update('user-id', updateUserDto);

      expect(service.update).toHaveBeenCalledWith('user-id', updateUserDto);
      expect(result).toEqual({ ...mockUser, ...updateUserDto });
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockUserService.remove.mockResolvedValue(undefined);

      await controller.remove('user-id');

      expect(service.remove).toHaveBeenCalledWith('user-id');
    });
  });
});
