/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Auth0JWTGuard } from 'src/core/authentication/auth/guards/auth0-jwt.guard';

@Injectable()
export class WsGuard extends Auth0JWTGuard {
  getRequest(context: ExecutionContext) {
    const wsContext = context.switchToWs();
    const client = wsContext.getClient();

    return {
      headers: client.handshake.headers,
    };
  }
  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err || !user) {
      throw err || new WsException('Unauthorized: invalid auth0 token');
    }
    return user;
  }
}
