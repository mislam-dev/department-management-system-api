import { Module } from '@nestjs/common';
import { CourseModule } from 'src/modules/academic/course/course.module';
import { RoomModule } from 'src/modules/academic/room/room.module';
import { TeacherUnavailabilityModule } from 'src/modules/attendance/teacher_unavailability/teacher_unavailability.module';
import { TeacherModule } from 'src/modules/identity/teacher/teacher.module';
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
