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
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { SetPermissions } from 'src/core/authentication/auth/decorators/set-permissions.decorator';
import { CourseScheduleService } from './course_schedule.service';
import { CreateCourseScheduleDto } from './dto/create-course_schedule.dto';
import { UpdateCourseScheduleDto } from './dto/update-course_schedule.dto';

@Controller('course/:courseId/schedule')
export class CourseScheduleController {
  constructor(private readonly courseScheduleService: CourseScheduleService) {}

  @SetPermissions('course-schedules:add')
  @Post()
  create(
    @Param('courseId') courseId: string,
    @Body() createCourseScheduleDto: CreateCourseScheduleDto,
  ) {
    return this.courseScheduleService.create(courseId, createCourseScheduleDto);
  }

  @SetPermissions('course-schedules:read')
  @Get()
  findAll(
    @Param('courseId') courseId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.courseScheduleService.findAll(courseId, {
      limit: pagination.limit || 10,
      offset: pagination.offset || 0,
    });
  }
  @SetPermissions('course-schedules:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseScheduleService.findOne(id);
  }

  @SetPermissions('course-schedules:update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseScheduleDto: UpdateCourseScheduleDto,
  ) {
    return this.courseScheduleService.update(id, updateCourseScheduleDto);
  }
  @SetPermissions('course-schedules:delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseScheduleService.remove(id);
  }
}
