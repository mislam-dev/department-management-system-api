import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class Auth0JWTGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request: Request = context.switchToHttp().getRequest();
    const allowedUrl = ['/metrics/', '/health', '/'];
    const isAllowed = allowedUrl.some((url) => request.url.startsWith(url));
    if (isPublic || isAllowed) return true;

    return super.canActivate(context);
  }
}
