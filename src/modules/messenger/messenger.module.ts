import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [ChatModule, GatewayModule],
})
export class MessengerModule {}
