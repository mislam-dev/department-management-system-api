import { PartialType } from '@nestjs/swagger'; // Use '@nestjs/mapped-types' if not using Swagger
import { CreateTeacherAttendanceDto } from './create-teacher-attendance.dto';

export class UpdateTeacherAttendanceDto extends PartialType(
  CreateTeacherAttendanceDto,
) {}
