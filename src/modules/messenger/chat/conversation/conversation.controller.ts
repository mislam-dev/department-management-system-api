import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  User,
  type UserPayload,
} from 'src/core/authentication/auth/decorators/user.decorator';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  create(
    @Body() createConversationDto: CreateConversationDto,
    @User() user: UserPayload,
  ) {
    return this.conversationService.create({
      ...createConversationDto,
      userId: user.sub,
    });
  }

  @Post('/group')
  createGroup(
    @Body() createConversationDto: CreateConversationDto,
    @User() user: UserPayload,
  ) {
    return this.conversationService.createGroup({
      ...createConversationDto,
      userId: user.sub,
    });
  }

  @Get()
  findAll(@User() user: UserPayload) {
    return this.conversationService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conversationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationService.update(id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationService.remove(id);
  }
}
