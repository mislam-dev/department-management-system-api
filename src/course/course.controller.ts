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
import { PaginationDto } from 'src/pagination/pagination.dto';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @SetPermissions('courses:add')
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @SetPermissions('courses:read')
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.courseService.findAll({
      limit: pagination.limit || 10,
      offset: pagination.offset || 0,
    });
  }

  @SetPermissions('courses:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @SetPermissions('courses:update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @SetPermissions('courses:delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
