import { ServiceError, status } from '@grpc/grpc-js';
import {
  BadRequestException,
  CallHandler,
  ConflictException,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class GrpcToHttpInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GrpcToHttpInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error: ServiceError) => {
        const isGrpcError = (err: ServiceError): err is ServiceError => {
          return (
            err &&
            typeof err.code === 'number' &&
            typeof err.message === 'string'
          );
        };

        if (!isGrpcError(error)) {
          return throwError(() => new InternalServerErrorException(error));
        }

        // Clean gRPC prepended message (e.g. "6 ALREADY_EXISTS: message" -> "message")
        const cleanMessage = error.message.replace(/^\d+\s+[A-Z_]+:\s+/, '');
        const { code } = error;

        switch (code) {
          case status.ALREADY_EXISTS:
            return throwError(() => new ConflictException(cleanMessage));

          case status.NOT_FOUND:
            return throwError(() => new NotFoundException(cleanMessage));

          case status.UNAUTHENTICATED:
            return throwError(() => new UnauthorizedException(cleanMessage));

          case status.PERMISSION_DENIED:
            return throwError(() => new ForbiddenException(cleanMessage));

          case status.INVALID_ARGUMENT:
            return throwError(() => new BadRequestException(cleanMessage));

          default:
            this.logger.error('GRPC Internal Server Error!', error);
            return throwError(
              () =>
                new InternalServerErrorException(
                  cleanMessage || 'Internal Server Error!',
                ),
            );
        }
      }),
    );
  }
}
