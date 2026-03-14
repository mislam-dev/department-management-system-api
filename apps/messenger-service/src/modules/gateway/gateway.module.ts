import { Module } from '@nestjs/common';
import { ChatModule } from '../chat/chat.module';
import { ConversationModule } from '../chat/conversation/conversation.module';
import { ChatGateway } from './chat.gateway';
import { JwtTokenService } from './jwt-token.service';

@Module({
  imports: [ChatModule, ConversationModule],
  providers: [ChatGateway, JwtTokenService],
})
export class GatewayModule {}
