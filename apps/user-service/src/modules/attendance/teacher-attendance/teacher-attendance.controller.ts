import {
  SetPermissions,
  User,
  type UserPayload,
} from '@app/common/auth/decorators';
import { PaginationDto } from '@app/common/pagination';
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
} from '@nestjs/common';
import { CreateTeacherAttendanceDto } from './dto/create-teacher-attendance.dto';
import { UpdateTeacherAttendanceDto } from './dto/update-teacher-attendance.dto';
import { TeacherAttendanceService } from './teacher-attendance.service';

@Controller('teacher/:teacherId/attendance')
@CacheTTL(1000 * 60 * 15) // 15 minutes
export class TeacherAttendanceController {
  constructor(
    private readonly teacherAttendanceService: TeacherAttendanceService,
  ) {}

  @SetPermissions('teacher-attendance:add')
  @Post()
  create(
    @Body() createTeacherAttendanceDto: CreateTeacherAttendanceDto,
    @Param('teacherId') teacherId: string,
    @User() user: UserPayload,
  ) {
    return this.teacherAttendanceService.create({
      ...createTeacherAttendanceDto,
      teacherId,
      recordedById: user.userId,
    });
  }

  @SetPermissions('teacher-attendance:read')
  @Get()
  findAll(
    @Param('teacherId') teacherId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.teacherAttendanceService.findAll({ teacherId, ...pagination });
  }

  @SetPermissions('teacher-attendance:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherAttendanceService.findOne(id);
  }

  @SetPermissions('teacher-attendance:update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeacherAttendanceDto: UpdateTeacherAttendanceDto,
  ) {
    return this.teacherAttendanceService.update(id, updateTeacherAttendanceDto);
  }

  @SetPermissions('teacher-attendance:remove')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherAttendanceService.remove(id);
  }
}
