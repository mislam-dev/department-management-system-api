import { PartialType } from '@nestjs/swagger';
import { CreateCourseScheduleDto } from './create-course_schedule.dto';

export class UpdateCourseScheduleDto extends PartialType(
  CreateCourseScheduleDto,
) {}
