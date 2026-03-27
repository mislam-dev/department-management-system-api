/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { status } from '@grpc/grpc-js';
import { Catch, Logger, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  private logger = new Logger(ExceptionFilter.name);
  catch(exception: any): Observable<any> {
    let code = status.INTERNAL;
    let message = 'Internal Server Error';

    if (exception.name === 'EntityNotFound') {
      this.logger.error('entity not found!');
      code = status.NOT_FOUND;
      message = 'Entity not found';
    } else if (exception instanceof RpcException) {
      this.logger.error('rpc exception!');
      return throwError(() => exception.getError());
    } else if (exception.status === 400) {
      this.logger.error('bad request!');
      code = status.INVALID_ARGUMENT;
      message = Array.isArray(exception?.response?.message)
        ? exception.response?.message.join(', ')
        : exception.message || 'Invalid argument';
    }

    this.logger.debug('returning error');

    return throwError(() => ({ code, message }));
  }
}
