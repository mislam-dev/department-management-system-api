import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParticipantDto } from '../participants/dto/create-participant.dto';
import { ParticipantRole } from '../participants/entities/participant.entity';
import { ParticipantsService } from '../participants/participants.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';
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
    createConversationDto: CreateGroupConversationDto & {
      userId: string;
    },
  ) {
    const conversation = this.conversationRepo.create({
      isRestricted: false,
      type: ConversationType.GROUP,
    });

    await this.conversationRepo.save(conversation);
    const participants: CreateParticipantDto[] =
      createConversationDto.members.map((memberId) => ({
        conversationId: conversation.id,
        userId: memberId,
        role: ParticipantRole.MEMBER,
      }));
    participants.push({
      conversationId: conversation.id,
      userId: createConversationDto.userId,
      role: ParticipantRole.ADMIN,
    });
    await this.participantService.createMany(participants);
    return conversation;
  }

  async findAll(userId: string) {
    return this.conversationRepo.find({
      relations: ['participants'],
      where: { participants: { userId } },
    });
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
