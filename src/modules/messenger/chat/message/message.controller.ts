import { Controller, Delete, Get, Param } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('conversations/:conversationId/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  findAll(@Param('conversationId') conversationId: string) {
    return this.messageService.findAll(conversationId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
}
