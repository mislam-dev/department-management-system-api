import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseScheduleModule } from 'src/course_schedule/course_schedule.module';
import { StudentModule } from 'src/student/student.module';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { IsUniqueAttendanceConstraint } from './validators/is-unique-attendance.validator';
import { IsValidCourseScheduleIdConstraint } from './validators/is-valid-course-schedule-id.validator';
import { IsValidStudentIDConstraint } from './validators/is-valid-student-id.validator';

@Module({
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    IsUniqueAttendanceConstraint,
    IsValidCourseScheduleIdConstraint,
    IsValidStudentIDConstraint,
  ],
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    CourseScheduleModule,
    StudentModule,
  ],
})
export class AttendanceModule {}
