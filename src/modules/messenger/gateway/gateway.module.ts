import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/identity/user/user.module';
import { ChatModule } from '../chat/chat.module';
import { ConversationModule } from '../chat/conversation/conversation.module';
import { ChatGateway } from './chat.gateway';
import { JwtTokenService } from './jwt-token.service';

@Module({
  imports: [ChatModule, UserModule, ConversationModule],
  providers: [ChatGateway, JwtTokenService],
})
export class GatewayModule {}
