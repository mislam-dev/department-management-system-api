import { AUTH0_PACKAGE_NAME } from '@app/grpc/protos/auth0';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ChatModule } from '../chat/chat.module';
import { ConversationModule } from '../chat/conversation/conversation.module';
import { ChatGateway } from './chat.gateway';
import { JwtTokenService } from './jwt-token.service';

@Module({
  imports: [
    ChatModule,
    ConversationModule,
    ClientsModule.register([
      {
        name: AUTH0_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH0_PACKAGE_NAME,
          protoPath: join(process.cwd(), 'libs/grpc/src/protos/auth0.proto'),
          url: 'auth_service:5002',
        },
      },
    ]),
  ],
  providers: [ChatGateway, JwtTokenService],
})
export class GatewayModule {}
