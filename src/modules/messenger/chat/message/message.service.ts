import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}
  create(createMessageDto: CreateMessageDto) {
    const message = this.messageRepo.create(createMessageDto);
    return this.messageRepo.save(message);
  }

  findAll(conversationId: string) {
    return this.messageRepo.find({ where: { conversationId } });
  }

  async findOne(id: string) {
    const message = await this.messageRepo.findOne({ where: { id } });
    if (!message) {
      throw new Error('Message not found');
    }
    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    const message = await this.findOne(id);
    Object.assign(message, updateMessageDto);
    return this.messageRepo.save(message);
  }

  async remove(id: string) {
    const result = await this.messageRepo.delete({ id });
    if (!result.affected) {
      throw new Error('Message not found');
    }
  }
}
