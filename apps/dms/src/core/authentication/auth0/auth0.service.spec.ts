import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Auth0Service } from './auth0.service';

// Mock the auth0 library
jest.mock('auth0', () => {
  return {
    ManagementClient: jest.fn().mockImplementation(() => {
      return {
        users: {
          list: jest.fn(),
          get: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        },
        roles: {
          list: jest.fn(),
          get: jest.fn(),
        },
      };
    }),
  };
});

describe('Auth0Service', () => {
  let service: Auth0Service;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        'auth0_m2m.domain': 'domain',
        'auth0_m2m.clientId': 'id',
        'auth0_m2m.clientSecret': 'secret',
        'auth0_m2m.connection': 'connection',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Auth0Service,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<Auth0Service>(Auth0Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Since we mocked the constructor internal, accessing the mock instance is a bit tricky
  // without exposing it or using the mock class constructor to get the instance.
  // But since we are testing the service methods which call methods on this internal instance,
  // we can spy/mock the behavior.

  // Actually, we can just test if methods run without error and assume the mock is called.
  // A better way is:

  it('should list users', async () => {
    const mockList = jest.fn().mockResolvedValue({ data: [] });
    // We need to access the private auth0 property or rely on the mock factory.
    // Let's use `(service as any).auth0`
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (service as any).auth0.users.list = mockList;

    await service.getUsers();
    expect(mockList).toHaveBeenCalled();
  });

  it('should get a user', async () => {
    const mockGet = jest.fn().mockResolvedValue({ user_id: '1' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (service as any).auth0.users.get = mockGet;

    await service.getUser('1');
    expect(mockGet).toHaveBeenCalledWith('1');
  });

  it('should create a user', async () => {
    const mockCreate = jest.fn().mockResolvedValue({ user_id: '1' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (service as any).auth0.users.create = mockCreate;

    const dto = { email: 'test@example.com', password: 'pwd', name: 'test' };
    await service.createUser(dto);

    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining(dto));
  });

  it('should update a user', async () => {
    const mockUpdate = jest.fn().mockResolvedValue({ user_id: '1' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (service as any).auth0.users.update = mockUpdate;

    await service.updateUser('1', { name: 'new' });
    expect(mockUpdate).toHaveBeenCalled();
  });

  it('should delete a user', async () => {
    const mockDelete = jest.fn().mockResolvedValue({});
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (service as any).auth0.users.delete = mockDelete;

    await service.deleteUser('1');
    expect(mockDelete).toHaveBeenCalledWith('1');
  });

  it('should list roles', async () => {
    const mockList = jest.fn().mockResolvedValue([]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (service as any).auth0.roles.list = mockList;

    await service.getAllRoles();
    expect(mockList).toHaveBeenCalled();
  });

  it('should get role by id', async () => {
    const mockGet = jest.fn().mockResolvedValue({});
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (service as any).auth0.roles.get = mockGet;

    await service.getRoleById('1');
    expect(mockGet).toHaveBeenCalledWith('1');
  });
});
