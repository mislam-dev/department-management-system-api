import { Module } from '@nestjs/common';
import { CourseModule } from 'src/course/course.module';
import { RoomModule } from 'src/room/room.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import { TeacherUnavailabilityModule } from 'src/teacher_unavailability/teacher_unavailability.module';
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
