import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as jwks from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class Auth0JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(readonly config: ConfigService) {
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

  validate(payload): unknown {
    return payload;
  }
}
