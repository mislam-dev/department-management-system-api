import {
  BadRequestException,
  UseFilters,
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
import { UserPayload } from 'src/core/authentication/auth/decorators/user.decorator';
import { UserService } from 'src/modules/identity/user/user.service';
import { ChatService } from '../chat/chat.service';
import { ConversationService } from '../chat/conversation/conversation.service';
import { MessageBodyDto } from './dtos/send-messge.dto';
import { JwtTokenService } from './jwt-token.service';
import { WebsocketExceptionsFilter } from './web-socket-exception.filter';

interface SocketAuth {
  userId: string;
  token?: string;
}

@UseFilters(new WebsocketExceptionsFilter())
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
    private readonly userService: UserService,
    private readonly conversationService: ConversationService,
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

    const user = await this.userService.findOneByAuth0Id(payload.sub);
    const allConversations = await this.conversationService.findAll(user.id);
    const ids = allConversations.map((conversation) => conversation.id);
    await client.join(ids);

    client.handshake.auth = { ...payload, userId: user.id };
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
