/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { SetPermissions } from '@app/common/auth/decorators';
import { Auth0JWTGuard, PermissionsGuard } from '@app/common/auth/guards';
import {
  Controller,
  Get,
  Logger,
  Req,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @UseGuards(Auth0JWTGuard, PermissionsGuard)
  @SetPermissions('roles:read')
  @Get('roles')
  usersRoles() {
    return this.authService.roles();
  }

  @UseGuards(Auth0JWTGuard)
  @Get('me')
  me(@Req() req: Request) {
    const user = (req as any).user ?? {};

    return user;
  }

  @UseGuards(Auth0JWTGuard)
  @Get('profile')
  profile(@Req() req: Request) {
    const user: { sub: string } = (req as any).user ?? {};

    return this.authService.profile(user.sub);
  }

  // todo remove on production
  @Get('login')
  login(@Response() res) {
    const domain = this.config.get<string>('auth0.domain');
    const clientId = this.config.get<string>('auth0.clientId');
    const callbackUrl = this.config.get<string>('auth0.callbackUrl');
    const audience = this.config.get<string>('auth0.audience');
    const url =
      `https://${domain}/authorize?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${callbackUrl}&` +
      `scope=openid%20profile%20email&` +
      `audience=${audience}&` +
      `code_challenge_method=none`;
    this.logger.debug(url);
    console.log(url);
    return res.redirect(url);
  }

  // todo remove in production
  @Get('auth/callback')
  async callback(@Request() req, @Response() res) {
    const code: string = req.query.code || '';

    const domain = this.config.get<string>('auth0.domain');
    const clientId = this.config.get<string>('auth0.clientId');
    const callbackUrl = this.config.get<string>('auth0.callbackUrl');
    const clientSecret = this.config.get<string>('auth0.clientSecret');

    const tokenResponse = await axios.post(`https://${domain}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: callbackUrl,
    });

    return res.json(tokenResponse.data);
  }
}
