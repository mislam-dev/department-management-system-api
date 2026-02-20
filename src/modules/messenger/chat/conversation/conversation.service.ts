import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParticipantsService } from '../participants/participants.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Conversation, ConversationType } from './entities/conversation.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    private readonly participantService: ParticipantsService,
  ) {}

  async create(
    createConversationDto: CreateConversationDto & {
      userId: string;
    },
  ) {
    const conversation = this.conversationRepo.create({
      isRestricted: false,
      type: ConversationType.P2P,
    });
    await this.conversationRepo.save(conversation);
    await this.participantService.createMany([
      {
        conversationId: conversation.id,
        userId: createConversationDto.memberId,
      },
      {
        conversationId: conversation.id,
        userId: createConversationDto.userId,
      },
    ]);
    return conversation;
  }

  async createGroup(
    createConversationDto: CreateConversationDto & {
      memberId: string;
      userId: string;
    },
  ) {
    const conversation = this.conversationRepo.create({
      isRestricted: false,
      type: ConversationType.GROUP,
    });
    await this.participantService.createMany([
      {
        conversationId: conversation.id,
        userId: createConversationDto.memberId,
      },
      {
        conversationId: conversation.id,
        userId: createConversationDto.userId,
      },
    ]);
    return this.conversationRepo.save(conversation);
  }

  findAll() {
    return this.conversationRepo.find({});
  }

  async findOne(conversationId: string) {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
    });
    if (!conversation) {
      throw new NotFoundException('Conversations not found');
    }
    return conversation;
  }

  async update(
    conversationId: string,
    updateConversationDto: UpdateConversationDto,
  ) {
    const conversation = await this.findOne(conversationId);
    Object.assign(conversation, updateConversationDto);
    return this.conversationRepo.save(conversation);
  }

  async remove(conversationId: string) {
    const result = await this.conversationRepo.delete(conversationId);
    if (!result.affected) {
      throw new NotFoundException('Conversation not found');
    }
  }
}
