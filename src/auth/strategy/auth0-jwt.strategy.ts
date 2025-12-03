import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as jwks from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { UserPayload } from '../decorators/user.decorator';

@Injectable()
export class Auth0JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    readonly config: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: config.get<string>('auth0.audience'),
      issuer: `https://${config.get<string>('auth0.domain')}/`,
      algorithms: ['RS256'],
      secretOrKeyProvider: jwks.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${config.get<string>('auth0.domain')}/.well-known/jwks.json`,
      }),
    });
  }

  async validate(payload: UserPayload): Promise<UserPayload> {
    try {
      const user = await this.userService.findOneByAuth0Id(payload.sub);
      return { ...payload, userId: user.id };
    } catch {
      throw new HttpException(
        'Auth0 user and database user synchronization failed',
        HttpStatus.CONFLICT,
      );
    }
  }
}
