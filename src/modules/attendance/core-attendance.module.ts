import { Module } from '@nestjs/common';
import { AttendanceModule } from './attendance/attendance.module';
import { TeacherAttendanceModule } from './teacher-attendance/teacher-attendance.module';
import { TeacherUnavailabilityModule } from './teacher_unavailability/teacher_unavailability.module';

@Module({
  imports: [
    TeacherUnavailabilityModule,
    AttendanceModule,
    TeacherAttendanceModule,
  ],
  exports: [
    TeacherUnavailabilityModule,
    AttendanceModule,
    TeacherAttendanceModule,
  ],
})
export class CoreAttendanceModule {}
