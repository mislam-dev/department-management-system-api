import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CourseScheduleService } from './course_schedule.service';
import { CreateCourseScheduleDto } from './dto/create-course_schedule.dto';
import { UpdateCourseScheduleDto } from './dto/update-course_schedule.dto';

@Controller('course/:courseId/schedule')
export class CourseScheduleController {
  constructor(private readonly courseScheduleService: CourseScheduleService) {}

  @Post()
  create(
    @Param('courseId') courseId: string,
    @Body() createCourseScheduleDto: CreateCourseScheduleDto,
  ) {
    return this.courseScheduleService.create(courseId, createCourseScheduleDto);
  }

  @Get()
  findAll(@Param('courseId') courseId: string) {
    return this.courseScheduleService.findAll(courseId);
  }

  @Get(':id')
  findOne(@Param('courseId') courseId, @Param('id') id: string) {
    return this.courseScheduleService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseScheduleDto: UpdateCourseScheduleDto,
  ) {
    return this.courseScheduleService.update(id, updateCourseScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseScheduleService.remove(id);
  }
}
