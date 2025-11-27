import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { IsUniqueAttendanceConstraint } from './validators/is-unique-attendance.validator';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, IsUniqueAttendanceConstraint],
  imports: [TypeOrmModule.forFeature([Attendance])],
})
export class AttendanceModule {}
