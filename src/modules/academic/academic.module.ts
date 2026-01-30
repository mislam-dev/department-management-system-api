import { Module } from '@nestjs/common';
import { ActivityModule } from './activity/activity.module';
import { CourseGenerateModule } from './course-generate/course-generate.module';
import { CourseModule } from './course/course.module';
import { CourseScheduleModule } from './course_schedule/course_schedule.module';
import { NoticeModule } from './notice/notice.module';
import { RoomModule } from './room/room.module';
import { SemesterModule } from './semester/semester.module';

@Module({
  imports: [
    ActivityModule,
    CourseModule,
    CourseScheduleModule,
    CourseGenerateModule,
    NoticeModule,
    RoomModule,
    SemesterModule,
  ],
  exports: [
    ActivityModule,
    CourseModule,
    CourseScheduleModule,
    CourseGenerateModule,
    NoticeModule,
    RoomModule,
    SemesterModule,
  ],
})
export class AcademicModule {}
