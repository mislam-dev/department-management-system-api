/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { status } from '@grpc/grpc-js';
import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: any): Observable<any> {
    let code = status.INTERNAL;
    let message = 'Internal Server Error';

    if (exception.name === 'EntityNotFound') {
      code = status.NOT_FOUND;
      message = 'Entity not found';
    } else if (exception instanceof RpcException) {
      return throwError(() => exception.getError());
    } else if (exception.status === 400) {
      code = status.INVALID_ARGUMENT;
      message = Array.isArray(exception?.response?.message)
        ? exception.response?.message.join(', ')
        : exception.message || 'Invalid argument';
    }

    return throwError(() => ({ code, message }));
  }
}
