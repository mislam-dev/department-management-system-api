import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth0Service } from 'src/core/authentication/auth0/auth0.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let repository: Record<string, jest.Mock>;
  let auth0Service: Record<string, jest.Mock>;

  const mockUser = {
    id: 'user-id',
    email: 'test@example.com',
    fullName: 'Test User',
    designation: 'student',
    auth0_user_id: 'auth0-id',
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

  const mockAuth0Service = {
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: Auth0Service,
          useValue: mockAuth0Service,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(getRepositoryToken(User));
    auth0Service = module.get<Auth0Service>(Auth0Service) as unknown as Record<
      string,
      jest.Mock
    >;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password',
      designation: 'student',
    };

    it('should create a new user', async () => {
      mockAuth0Service.createUser.mockResolvedValue({ user_id: 'auth0-id' });
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(auth0Service.createUser).toHaveBeenCalledWith({
        name: createUserDto.fullName,
        password: createUserDto.password,
        email: createUserDto.email,
      });
      expect(repository.create).toHaveBeenCalledWith({
        fullName: createUserDto.fullName,
        designation: createUserDto.designation,
        email: createUserDto.email,
        auth0_user_id: 'auth0-id',
      });
      expect(repository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return a list of users with pagination', async () => {
      const limit = 10;
      const offset = 0;
      const total = 1;
      mockRepository.findAndCount.mockResolvedValue([[mockUser], total]);

      const result = await service.findAll({ limit, offset });

      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: offset,
        take: limit,
        order: { createdAt: 'desc' },
      });
      expect(result).toEqual({
        total,
        limit,
        offset,
        results: [mockUser],
      });
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('user-id');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-id' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneByAuth0Id', () => {
    it('should find a user by auth0 id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneByAuth0Id('auth0-id');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { auth0_user_id: 'auth0-id' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOneByAuth0Id('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByEmail('invalid-email')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      fullName: 'Updated Name',
      email: 'updated@example.com',
    };

    it('should update a user', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockAuth0Service.updateUser.mockResolvedValue(undefined);
      const updatedUser = { ...mockUser, ...updateUserDto };
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update('user-id', updateUserDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-id' },
      });

      // Verify auth0 update called with merged data
      // Since Object.assign mutates the object returned by findOne, mockUser itself is mutated if it's the same reference
      // But in the test we might be reusing mockUser.
      // To be safe, let's just check the arguments

      expect(auth0Service.updateUser).toHaveBeenCalledWith(
        mockUser.auth0_user_id,
        expect.objectContaining({
          email: updateUserDto.email,
          name: updateUserDto.fullName,
        }),
      );

      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user to update is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('invalid-id', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(auth0Service.updateUser).not.toHaveBeenCalled();
      expect(repository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockAuth0Service.deleteUser.mockResolvedValue(undefined);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('user-id');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-id' },
      });
      expect(auth0Service.deleteUser).toHaveBeenCalledWith('auth0-id');
      expect(repository.delete).toHaveBeenCalledWith('user-id');
    });

    it('should throw NotFoundException if user to remove not found (findOne)', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if delete result not affected', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockAuth0Service.deleteUser.mockResolvedValue(undefined);
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('user-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
