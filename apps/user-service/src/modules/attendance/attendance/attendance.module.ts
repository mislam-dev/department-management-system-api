import { COURSE_SCHEDULE_PACKAGE_NAME } from '@app/grpc/protos/course/course-schedule';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { StudentModule } from '../../identity/student/student.module';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { GrpcCourseScheduleServiceClient } from './grpc/course-schedule.client';
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
    GrpcCourseScheduleServiceClient,
  ],
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    StudentModule,
    ClientsModule.register([
      {
        name: COURSE_SCHEDULE_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: COURSE_SCHEDULE_PACKAGE_NAME,
          protoPath: join(
            process.cwd(),
            'libs/grpc/src/protos/course/course-schedule.proto',
          ),
          url: 'academic_service:5001',
        },
      },
    ]),
  ],
})
export class AttendanceModule {}
