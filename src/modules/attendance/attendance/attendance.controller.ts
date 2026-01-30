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
import { SetPermissions } from 'src/core/authentication/auth/decorators/set-permissions.decorator';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @SetPermissions('attendance:create')
  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @SetPermissions('attendance:read')
  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    return this.attendanceService.findAll(
      {
        limit: query.limit || 10,
        offset: query.offset || 0,
      },
      query.studentId,
    );
  }

  @SetPermissions('attendance:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @SetPermissions('attendance:update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @SetPermissions('attendance:delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
