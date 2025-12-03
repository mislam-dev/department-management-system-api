import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SetPermissions } from 'src/auth/decorators/set-permissions.decorator';
import { User, type UserPayload } from 'src/auth/decorators/user.decorator';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { NoticeService } from './notice.service';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @SetPermissions('notices:add')
  @Post()
  create(@Body() createNoticeDto: CreateNoticeDto, @User() user: UserPayload) {
    return this.noticeService.create({
      ...createNoticeDto,
      createdById: user.userId,
    });
  }

  @SetPermissions('notices:read')
  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    return this.noticeService.findAll({
      limit: query.limit || 10,
      offset: query.offset || 0,
    });
  }

  @SetPermissions('notices:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noticeService.findOne(id);
  }

  @SetPermissions('notices:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoticeDto: UpdateNoticeDto) {
    return this.noticeService.update(id, updateNoticeDto);
  }

  @SetPermissions('notices:delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noticeService.remove(id);
  }
}
