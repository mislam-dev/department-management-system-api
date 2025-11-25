import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { SetRolePermissions } from './decorators/set-roles-permissions.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @SetRolePermissions(['admin'], [])
  @Get('roles')
  usersRoles() {
    return this.authService.roles();
  }

  @Get('me')
  me(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user: { sub: string } = (req as any).user ?? {};
    return this.userService.findOneByAuth0Id(user.sub);
  }

  @Get('profile')
  async profile(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user: { sub: string } = (req as any).user ?? {};
    const dbUser = await this.userService.findOneByAuth0Id(user.sub);
    return this.authService.profile(dbUser.id);
  }
}
