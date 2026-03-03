import { CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  User,
  type UserPayload,
} from 'src/core/authentication/auth/decorators/user.decorator';
import { HttpCacheInterceptor } from 'src/core/cache/http-cache/http-cache.interceptor';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateGroupConversationDto } from './dto/create-group-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Controller('conversation')
@UseInterceptors(HttpCacheInterceptor)
@CacheTTL(1000 * 60 * 15) // 15 minutes
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  create(
    @Body() createConversationDto: CreateConversationDto,
    @User() user: UserPayload,
  ) {
    return this.conversationService.create({
      ...createConversationDto,
      userId: user.userId,
    });
  }

  @Post('/group')
  createGroup(
    @Body() createConversationDto: CreateGroupConversationDto,
    @User() user: UserPayload,
  ) {
    return this.conversationService.createGroup({
      ...createConversationDto,
      userId: user.userId,
    });
  }

  @Get()
  findAll(@User() user: UserPayload) {
    return this.conversationService.findAll(user.userId);
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
