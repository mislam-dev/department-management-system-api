import { CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { SetPermissions } from 'src/core/authentication/auth/decorators/set-permissions.decorator';
import { HttpCacheInterceptor } from 'src/core/cache/http-cache/http-cache.interceptor';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherService } from './teacher.service';

@Controller('teacher')
@UseInterceptors(HttpCacheInterceptor)
@CacheTTL(1000 * 60 * 60 * 24 * 45) // 45 days
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @SetPermissions('teachers:create')
  @Post()
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @SetPermissions('teachers:read')
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.teacherService.findAll({
      limit: pagination.limit || 10,
      offset: pagination.offset || 0,
    });
  }

  @SetPermissions('teachers:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherService.findOne(id);
  }

  @SetPermissions('teachers:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(id, updateTeacherDto);
  }

  @SetPermissions('teachers:delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherService.remove(id);
  }
}
