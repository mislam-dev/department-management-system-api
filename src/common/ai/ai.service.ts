import { Injectable } from '@nestjs/common';
import { CourseScheduleAgent } from './agents/course-schedule.agent';

export type CourseScheduleAssistantProps = {
  semesters: {
    ids: string[];
    start: string;
    end: string;
  };
  shifts?: '1' | '2';
  periodsLength?: number;
};

@Injectable()
export class AiService {
  constructor(private readonly courseScheduleAgent: CourseScheduleAgent) {}
  courseScheduleAssistant(data: CourseScheduleAssistantProps) {
    return this.courseScheduleAgent.ask(data);
  }
}
