import { BadRequestException, Injectable } from '@nestjs/common';
import { Auth0Service } from 'src/auth0/auth0.service';
import { StudentService } from 'src/student/student.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly auth0: Auth0Service,
    private readonly userService: UserService,
    private readonly studentService: StudentService,
    private readonly teacherService: TeacherService,
  ) {}
  async roles() {
    const roles = await this.auth0.getAllRoles();
    return roles.data;
  }
  async me() {
    const roles = await this.auth0.getAllRoles();
    return roles.data;
  }
  async profile(auth0_sub: string) {
    const dbUser = await this.userService.findOneByAuth0Id(auth0_sub);
    if (!dbUser.auth0_role)
      throw new BadRequestException('User profile not found!');
    const role = await this.auth0.getRoleById(dbUser.auth0_role);
    const roleName = role.name;
    console.log(roleName);
    if (roleName === 'admin') {
      const data = await this.auth0.getUser(dbUser.auth0_user_id);
      return {
        ...data,
        roleName,
      };
    }
    if (roleName === 'student') {
      const data = await this.studentService.findOneByUserId(dbUser.id);
      return {
        ...data,
        roleName,
      };
    }

    // todo connect with staff module after creation
    // if (roleName === 'staff' || roleName === 'librarian') {
    //   return;
    // }

    const data = await this.teacherService.findOneByUserId(dbUser.id);
    return {
      ...data,
      roleName,
    };
  }
}
