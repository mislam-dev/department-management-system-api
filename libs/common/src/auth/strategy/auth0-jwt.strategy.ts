/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Request } from 'express';
import { UserPayload } from '../decorators/user.decorator';

@Injectable()
export class Auth0JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: '-',
    });
  }

  authenticate(req: Request): void {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) return this.fail(401);
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString(),
    );
    this.success(payload);
  }

  validate(payload: UserPayload): UserPayload {
    return payload;
  }
}
