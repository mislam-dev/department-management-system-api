import { Module } from '@nestjs/common';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { ParticipantsModule } from './participants/participants.module';

@Module({
  imports: [ConversationModule, MessageModule, ParticipantsModule],
})
export class ChatModule {}
