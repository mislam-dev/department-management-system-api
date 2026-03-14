import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

@Injectable()
export class JwtTokenService {
  private jwtClient: JwksClient;
  constructor(private readonly config: ConfigService) {
    this.jwtClient = new JwksClient({
      jwksUri: `https://${this.config.get<string>('auth0.domain')}/.well-known/jwks.json`,
      cache: true,
      rateLimit: true,
    });
  }

  async validateToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        (header, callback) => {
          this.jwtClient.getSigningKey(header.kid, (err, key) => {
            const signingKey = key?.getPublicKey();
            callback(null, signingKey);
          });
        },
        {
          audience: this.config.get<string>('auth0.audience'),
          issuer: `https://${this.config.get<string>('auth0.domain')}/`,
          algorithms: ['RS256'],
        },
        (err, decoded) => {
          if (err) {
            reject(err);
          }
          resolve(decoded);
        },
      );
    });
  }
}
