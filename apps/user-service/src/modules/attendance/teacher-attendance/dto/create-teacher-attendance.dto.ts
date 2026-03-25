import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AttendanceStatus } from '../entities/teacher-attendance.entity'; // Adjust path as needed

export class CreateTeacherAttendanceDto {
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}
