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
import { CreateTeacherUnavailabilityDto } from './dto/create-teacher_unavailability.dto';
import { ResourceParamDto } from './dto/resource-query.dto';
import { UpdateTeacherUnavailabilityDto } from './dto/update-teacher_unavailability.dto';
import { TeacherUnavailabilityService } from './teacher_unavailability.service';

@Controller('teacher/:teacherId/unavailability')
export class TeacherUnavailabilityController {
  constructor(
    private readonly teacherUnavailabilityService: TeacherUnavailabilityService,
  ) {}

  @SetPermissions('teacher-unavailability:add')
  @Post()
  create(
    @Body() createDto: CreateTeacherUnavailabilityDto,
    @Param() { teacherId }: ResourceParamDto,
  ) {
    return this.teacherUnavailabilityService.create({
      ...createDto,
      teacherId,
    });
  }

  @SetPermissions('teacher-unavailability:read')
  @Get()
  findAll(
    @Param() { teacherId }: ResourceParamDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.teacherUnavailabilityService.findAll({
      ...pagination,
      teacherId,
    });
  }

  @SetPermissions('teacher-unavailability:read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherUnavailabilityService.findOne(id);
  }

  @SetPermissions('teacher-unavailability:update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeacherUnavailabilityDto: UpdateTeacherUnavailabilityDto,
  ) {
    return this.teacherUnavailabilityService.update(
      id,
      updateTeacherUnavailabilityDto,
    );
  }

  @SetPermissions('teacher-unavailability:remove')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teacherUnavailabilityService.remove(id);
  }
}
