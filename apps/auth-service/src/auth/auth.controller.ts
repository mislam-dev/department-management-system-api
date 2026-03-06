import { SetPermissions } from '@app/common/auth/decorators';
import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @SetPermissions('roles:read')
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
  profile(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user: { sub: string } = (req as any).user ?? {};

    return this.authService.profile(user.sub);
  }
}
