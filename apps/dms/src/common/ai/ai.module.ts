import { Module } from '@nestjs/common';
import { CourseModule } from '../../modules/academic/course/course.module';
import { RoomModule } from '../../modules/academic/room/room.module';
import { TeacherUnavailabilityModule } from '../../modules/attendance/teacher_unavailability/teacher_unavailability.module';
import { TeacherModule } from '../../modules/identity/teacher/teacher.module';
import { CourseScheduleAgent } from './agents/course-schedule.agent';
import { GeminiAiAgent } from './agents/gemini.agent';
import { AiService } from './ai.service';

@Module({
  controllers: [],
  imports: [
    TeacherModule,
    TeacherUnavailabilityModule,
    CourseModule,
    RoomModule,
  ],
  providers: [AiService, GeminiAiAgent, CourseScheduleAgent],
  exports: [AiService],
})
export class AiModule {}
