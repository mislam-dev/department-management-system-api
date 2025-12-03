import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { IsUniqueAttendance } from '../decorators/is-unique-attendance.decorator';
import { IsValidCourseScheduleId } from '../decorators/is-valid-course-schedule-id.decorator';
import { IsValidStudentId } from '../decorators/is-valid-student-id.decorator';
import { AttendanceStatus } from '../entities/attendance.entity';

export class CreateAttendanceDto {
  @IsUUID(undefined, { message: 'Student ID must be a valid UUID' })
  @IsValidStudentId()
  @IsUniqueAttendance()
  studentId: string;

  @IsDateString(
    { strict: true },
    { message: 'Date must be in YYYY-MM-DD format' },
  )
  date: string;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/, {
    message: 'checkInTime must be in HH:MM or HH:MM:SS format',
  })
  checkInTime?: string;

  @IsOptional()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/, {
    message: 'checkOutTime must be in HH:MM or HH:MM:SS format',
  })
  checkOutTime?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsUUID(undefined, { message: 'Course ID must be a valid UUID' })
  @IsValidCourseScheduleId()
  courseScheduleId: string;
}
