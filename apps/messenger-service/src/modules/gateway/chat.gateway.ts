import { UserPayload } from '@app/common/auth/decorators';
import { WsGuard } from '@app/common/auth/guards';
import {
  BadRequestException,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ValidationError } from 'class-validator';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../chat/chat.service';
import { ConversationService } from '../chat/conversation/conversation.service';
import { MessageBodyDto } from './dtos/send-messge.dto';
import { GrpcAuth0ServiceClient } from './grpc/auth0-service.client';
import { JwtTokenService } from './jwt-token.service';
import { WebsocketExceptionsFilter } from './web-socket-exception.filter';

interface SocketAuth {
  userId: string;
  token?: string;
}

@UseFilters(new WebsocketExceptionsFilter())
@UseGuards(WsGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly conversationService: ConversationService,
    private readonly auth0Service: GrpcAuth0ServiceClient,
  ) {}

  async handleConnection(client: Socket) {
    const authorization = client.handshake.headers.authorization;
    if (!authorization) {
      console.log('❌ Disconnecting: Missing Token');
      client.disconnect();
      return;
    }

    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer') {
      console.log('❌ Disconnecting: Invalid Token');
      client.disconnect();
      return;
    }
    const payload = (await this.jwtTokenService.validateToken(
      token,
    )) as UserPayload;

    const user = await this.auth0Service.getAuth0UserById(payload.sub);

    const allConversations = await this.conversationService.findAll(
      user.userId,
    );
    const ids = allConversations.map((conversation) => conversation.id);
    await client.join(ids);

    client.handshake.auth = { ...payload, userId: user.userId };
  }

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedError = errors.map((err) => {
          return {
            field: err.property,
            values: Object.values(err.constraints || {}),
          };
        });
        return new BadRequestException({
          status: 400,
          message: 'validation failed!',
          errors: formattedError,
        });
      },
    }),
  )
  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: MessageBodyDto,
  ) {
    const auth = client?.handshake?.auth as unknown as SocketAuth;
    const senderId = auth.userId;

    const savedMessage = await this.chatService.validateAndSaveMessage({
      content: data.content,
      conversationId: data.conversationId,
      senderId,
    });
    this.server.to(data.conversationId).emit('message:receive', savedMessage);
  }
}
