import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/identity/user/user.module';
import { ChatModule } from '../chat/chat.module';
import { ChatGateway } from './chat.gateway';
import { JwtTokenService } from './jwt-token.service';

@Module({
  imports: [ChatModule, UserModule],
  providers: [ChatGateway, JwtTokenService],
})
export class GatewayModule {}
