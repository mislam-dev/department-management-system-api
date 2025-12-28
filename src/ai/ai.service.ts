import { Injectable } from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { TeacherUnavailabilityService } from 'src/teacher_unavailability/teacher_unavailability.service';
import { In } from 'typeorm';
import { GeminiAiAgent } from './agents/gemini.agent';

export type CourseScheduleAssistantProps = {
  semesters: {
    ids: string[];
    start: string;
    end: string;
  };
};

@Injectable()
export class AiService {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly courseService: CourseService,
    private readonly teacherUnavailabilityService: TeacherUnavailabilityService,
    private readonly geminiAgent: GeminiAiAgent,
  ) {}
  async courseScheduleAssistant(data: CourseScheduleAssistantProps) {
    const prompt = await this.generatePrompt(data.semesters);
    const text = await this.geminiAgent.ask(prompt);
    console.log({ text });
    return text;
  }

  private async generatePrompt(
    semesters: CourseScheduleAssistantProps['semesters'],
  ) {
    const allTeachers = await this.teacherService.find({
      select: {
        id: true,
        userId: true,
      },
    });
    const allCourse = await this.courseService.find({
      where: {
        semesterId: In(semesters.ids),
      },
      select: {
        id: true,
        name: true,
        code: true,
        semesterId: true,
      },
    });
    const allTeachersUnavailability =
      await this.teacherUnavailabilityService.find({
        select: {
          teacherId: true,
          startDatetime: true,
          endDatetime: true,
          reason: true,
        },
      });

    const prompt = `
      You are a University Routine Scheduler. Create a conflict-free weekly class schedule.

      ### CONSTRAINTS:
      1. Date Range: ${semesters.start} to ${semesters.end}
      2. Scheduling Days: Monday to Friday.
      3. Hours: 09:00 AM to 05:00 PM.
      4. DO NOT schedule classes during Teacher Unavailability periods. If teacher unavailable for some days (2-3 days), then schedule those meetings. 
      5. Distribute courses evenly across the week.

      ### DATA:
      - Semesters Involved: ${JSON.stringify(semesters.ids)}
      - Available Teachers: ${JSON.stringify(allTeachers)}
      - Courses to Schedule: ${JSON.stringify(allCourse)}
      - Teacher Unavailability: ${JSON.stringify(allTeachersUnavailability)}

      ### OUTPUT FORMAT (Strict JSON):
      Return an array of objects. Do not include markdown formatting like \`\`\`json.
      [
        {
          "date": "YYYY-MM-DD",
          "day": "Monday",
          "time_slot": "09:00-10:30",
          "course_name": "String",
          "teacher_name": "String",
          "semester_name": "String"
        }
      ]
    `;

    return prompt;
  }
}
