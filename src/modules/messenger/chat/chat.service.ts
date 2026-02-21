import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConversationService } from './conversation/conversation.service';
import { MessageService } from './message/message.service';
import { ParticipantRole } from './participants/entities/participant.entity';
import { ParticipantsService } from './participants/participants.service';

export type Payload = {
  senderId: string;
  conversationId: string;
  content: string;
};

@Injectable()
export class ChatService {
  constructor(
    private readonly participantService: ParticipantsService,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
  ) {}

  async validateAndSaveMessage(payload: Payload) {
    const conversation = await this.conversationService.findOne(
      payload.conversationId,
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const participant = await this.participantService.findOneBy({
      conversationId: payload.conversationId,
      userId: payload.senderId,
    });
    if (!participant) {
      throw new NotFoundException('You are not a member of this conversation');
    }

    const isRestricted = conversation.isRestricted;
    const isAdmin = participant.role === ParticipantRole.ADMIN;
    if (isRestricted && !isAdmin) {
      throw new ForbiddenException(
        'This group is restricted. Only Admins can send messages.',
      );
    }
    const message = await this.messageService.create({
      senderId: payload.senderId,
      conversationId: payload.conversationId,
      content: payload.content,
    });
    return message;
  }
}
