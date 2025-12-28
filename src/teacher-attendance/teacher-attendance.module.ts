import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherAttendance } from './entities/teacher-attendance.entity';
import { TeacherAttendanceController } from './teacher-attendance.controller';
import { TeacherAttendanceService } from './teacher-attendance.service';

@Module({
  controllers: [TeacherAttendanceController],
  providers: [TeacherAttendanceService],
  imports: [TypeOrmModule.forFeature([TeacherAttendance])],
})
export class TeacherAttendanceModule {}
