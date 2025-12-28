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
import { User, type UserPayload } from 'src/auth/decorators/user.decorator';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { CreateTeacherAttendanceDto } from './dto/create-teacher-attendance.dto';
import { UpdateTeacherAttendanceDto } from './dto/update-teacher-attendance.dto';
import { TeacherAttendanceService } from './teacher-attendance.service';

@Controller('teacher/:teacherId/attendance')
export class TeacherAttendanceController {
  constructor(
    private readonly teacherAttendanceService: TeacherAttendanceService,
  ) {}

  @Post()
  create(
    @Body() createTeacherAttendanceDto: CreateTeacherAttendanceDto,
    @Param('teacherId') teacherId: string,
    @User() user: UserPayload,
  ) {
    // console.log('test');
    return this.teacherAttendanceService.create({
      ...createTeacherAttendanceDto,
      teacherId,
      recordedById: user.sub,
    });
  }

  @Get()
  findAll(
    @Param('teacherId') teacherId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.teacherAttendanceService.findAll({ teacherId, ...pagination });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherAttendanceService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeacherAttendanceDto: UpdateTeacherAttendanceDto,
  ) {
    return this.teacherAttendanceService.update(id, updateTeacherAttendanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherAttendanceService.remove(id);
  }
}
