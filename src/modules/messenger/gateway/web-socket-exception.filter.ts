import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const client = host.switchToWs().getClient() as Socket;
    const error =
      exception instanceof HttpException ? exception.getResponse() : exception;

    client.emit('message:send:failed', error);
  }
}
