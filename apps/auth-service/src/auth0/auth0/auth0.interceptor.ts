import { status } from '@grpc/grpc-js';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ManagementError } from 'auth0';
import { catchError, Observable, throwError } from 'rxjs';

interface Auth0ManagementBodyError {
  statusCode: number;
  error: string;
  message: string;
  errorCode: string;
}

@Injectable()
export class Auth0Interceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof ManagementError) {
          return throwError(() => this.handleAuth0Error(error));
        }
        return throwError(() => new InternalServerErrorException(error));
      }),
    );
  }
  private handleAuth0Error(error: ManagementError): never {
    const statusCode = error?.statusCode;
    const message =
      (error.body as Auth0ManagementBodyError).message ||
      error?.message ||
      'An error occurred with Auth0';

    switch (statusCode) {
      case 400:
        throw new RpcException({ code: status.INVALID_ARGUMENT, message });
      case 401:
        throw new RpcException({ code: status.UNAUTHENTICATED, message });
      case 403:
        throw new RpcException({ code: status.PERMISSION_DENIED, message });
      case 404:
        throw new RpcException({ code: status.NOT_FOUND, message });
      case 409:
        // Very common: "User already exists"
        throw new RpcException({ code: status.ALREADY_EXISTS, message });
      case 429:
        throw new RpcException({
          code: status.RESOURCE_EXHAUSTED,
          message: 'Auth0 Rate limit exceeded',
        });
      default:
        throw new RpcException({ code: status.INTERNAL, message });
    }
  }
}
