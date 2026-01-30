import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from 'src/common/ai/ai.module';
import { CourseModule } from 'src/modules/academic/course/course.module';
import { CourseScheduleController } from './course_schedule.controller';
import { CourseScheduleService } from './course_schedule.service';
import { CourseSchedule } from './entities/course_schedule.entity';
import { HasNoScheduleOverlapConstraint } from './validators/has-no-schedule-overlap.validator';
import { IsRoomAvailableConstraint } from './validators/is-room-available.validator';
import { IsTeacherAvailableConstraint } from './validators/is-teacher-available.validator';
import { IsUniqueScheduleConstraint } from './validators/is-unique-schedule.validator';
import { IsValidTimeRangeConstraint } from './validators/is-valid-time-range.validator';

@Module({
  controllers: [CourseScheduleController],
  providers: [
    CourseScheduleService,
    IsUniqueScheduleConstraint,
    HasNoScheduleOverlapConstraint,
    IsRoomAvailableConstraint,
    IsTeacherAvailableConstraint,
    IsValidTimeRangeConstraint,
  ],
  imports: [TypeOrmModule.forFeature([CourseSchedule]), CourseModule, AiModule],
  exports: [CourseScheduleService],
})
export class CourseScheduleModule {}
