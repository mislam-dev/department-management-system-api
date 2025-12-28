import { Module } from '@nestjs/common';
import { CourseModule } from 'src/course/course.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import { TeacherUnavailabilityModule } from 'src/teacher_unavailability/teacher_unavailability.module';
import { GeminiAiAgent } from './agents/gemini.agent';
import { AiService } from './ai.service';

@Module({
  controllers: [],
  imports: [TeacherModule, TeacherUnavailabilityModule, CourseModule],
  providers: [AiService, GeminiAiAgent],
  exports: [AiService],
})
export class AiModule {}
