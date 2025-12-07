import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { SetRoles } from './decorators/set-roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @SetRoles('admin') // todo replace with permission attribute
  @Get('roles')
  usersRoles() {
    return this.authService.roles();
  }

  @Get('me')
  me(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = (req as any).user ?? {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }

  @Get('profile')
  async profile(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user: { sub: string } = (req as any).user ?? {};

    return this.authService.profile(user.sub);
  }
}
