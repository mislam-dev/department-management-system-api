import { Module } from '@nestjs/common';
import { CourseScheduleAgent } from './agents/course-schedule.agent';
import { GeminiAiAgent } from './agents/gemini.agent';
import { AiService } from './ai.service';

@Module({
  controllers: [],
  imports: [],
  providers: [AiService, GeminiAiAgent, CourseScheduleAgent],
  exports: [AiService],
})
export class AiModule {}
