import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
const mockAuthService = {
  roles: jest.fn(),
  profile: jest.fn(),
};

const mockUserService = {};
describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('usersRoles', () => {
    it('should return roles', async () => {
      const roles = [{ name: 'admin' }];
      mockAuthService.roles.mockResolvedValue(roles);

      const result = await controller.usersRoles();
      expect(result).toEqual(roles);
    });
  });

  describe('me', () => {
    it('should return request user', async () => {
      const req = { user: { sub: 'sub-id' } };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await controller.me(req as unknown as Request);
      expect(result).toEqual(req.user);
    });

    it('should return empty object if user is missing', async () => {
      const req = {};
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await controller.me(req as unknown as Request);
      expect(result).toEqual({});
    });
  });

  describe('profile', () => {
    it('should return profile', async () => {
      const req = { user: { sub: 'sub-id' } };
      const profile = { name: 'Test' };
      mockAuthService.profile.mockResolvedValue(profile);

      const result = await controller.profile(req as unknown as Request);

      expect(mockAuthService.profile).toHaveBeenCalledWith('sub-id');
      expect(result).toEqual(profile);
    });
  });
});
