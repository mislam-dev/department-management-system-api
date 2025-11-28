/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { SetRolePermissions } from './auth/decorators/set-roles-permissions.decorator';
import { SetRoles } from './auth/decorators/set-roles.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly config: ConfigService,
  ) {}

  @SetRoles('admin')
  @SetRolePermissions(['admin'], ['read:users'])
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // todo remove on production
  @Public()
  @Get('login')
  login(@Res() res) {
    const domain = this.config.get<string>('auth0.domain');
    const clientId = this.config.get<string>('auth0.clientId');
    const callbackUrl = this.config.get<string>('auth0.callbackUrl');
    const audience = this.config.get<string>('auth0.audience');

    return res.redirect(
      `https://${domain}/authorize?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${callbackUrl}&` +
        `scope=openid%20profile%20email&` +
        `audience=${audience}&` +
        `code_challenge_method=none`,
    );
  }

  // todo remove in production
  @Public()
  @Get('auth/callback')
  async callback(@Req() req, @Res() res) {
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

    // tokenResponse.data contains:
    // access_token
    // id_token
    // token_type
    // expires_in

    return res.json(tokenResponse.data);
  }
}
