import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Auth0Service } from 'src/auth0/auth0.service';
import { StudentService } from 'src/student/student.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let auth0Service: any;
  let userService: any;
  let studentService: any;
  let teacherService: any;

  const mockDbUser = {
    id: 'db-user-id',
    auth0_user_id: 'auth0-user-id',
    auth0_role: 'role-id',
  };

  const mockAuth0Service = {
    getAllRoles: jest.fn(),
    getRoleById: jest.fn(),
    getUser: jest.fn(),
  };

  const mockUserService = {
    findOneByAuth0Id: jest.fn(),
  };

  const mockStudentService = {
    findOneByUserId: jest.fn(),
  };

  const mockTeacherService = {
    findOneByUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: Auth0Service, useValue: mockAuth0Service },
        { provide: UserService, useValue: mockUserService },
        { provide: StudentService, useValue: mockStudentService },
        { provide: TeacherService, useValue: mockTeacherService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    auth0Service = module.get(Auth0Service);
    userService = module.get(UserService);
    studentService = module.get(StudentService);
    teacherService = module.get(TeacherService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('roles', () => {
    it('should return all roles', async () => {
      const rolesData = [{ id: '1', name: 'admin' }];
      mockAuth0Service.getAllRoles.mockResolvedValue({ data: rolesData });

      const result = await service.roles();
      expect(result).toEqual(rolesData);
    });
  });

  describe('profile', () => {
    it('should return admin profile', async () => {
      mockUserService.findOneByAuth0Id.mockResolvedValue(mockDbUser);
      mockAuth0Service.getRoleById.mockResolvedValue({ name: 'admin' });
      const auth0User = { email: 'admin@example.com' };
      mockAuth0Service.getUser.mockResolvedValue(auth0User);

      const result = await service.profile('auth0-sub');

      expect(userService.findOneByAuth0Id).toHaveBeenCalledWith('auth0-sub');
      expect(auth0Service.getRoleById).toHaveBeenCalledWith(
        mockDbUser.auth0_role,
      );
      expect(auth0Service.getUser).toHaveBeenCalledWith(
        mockDbUser.auth0_user_id,
      );
      expect(result).toEqual({ ...auth0User, roleName: 'admin' });
    });

    it('should return student profile', async () => {
      mockUserService.findOneByAuth0Id.mockResolvedValue(mockDbUser);
      mockAuth0Service.getRoleById.mockResolvedValue({ name: 'student' });
      const studentData = { id: 'student-id' };
      mockStudentService.findOneByUserId.mockResolvedValue(studentData);

      const result = await service.profile('auth0-sub');

      expect(studentService.findOneByUserId).toHaveBeenCalledWith(
        mockDbUser.id,
      );
      expect(result).toEqual({ ...studentData, roleName: 'student' });
    });

    it('should return teacher profile (default else branch)', async () => {
      mockUserService.findOneByAuth0Id.mockResolvedValue(mockDbUser);
      mockAuth0Service.getRoleById.mockResolvedValue({ name: 'teacher' });
      const teacherData = { id: 'teacher-id' };
      mockTeacherService.findOneByUserId.mockResolvedValue(teacherData);

      const result = await service.profile('auth0-sub');

      expect(teacherService.findOneByUserId).toHaveBeenCalledWith(
        mockDbUser.id,
      );
      expect(result).toEqual({ ...teacherData, roleName: 'teacher' });
    });

    it('should throw BadRequestException if db user has no role', async () => {
      mockUserService.findOneByAuth0Id.mockResolvedValue({
        ...mockDbUser,
        auth0_role: null,
      });

      await expect(service.profile('auth0-sub')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
