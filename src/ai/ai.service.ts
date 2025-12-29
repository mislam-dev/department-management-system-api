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
  shifts?: '1' | '2';
  periodsLength?: number;
};

@Injectable()
export class AiService {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly courseService: CourseService,
    private readonly tUService: TeacherUnavailabilityService,
    private readonly geminiAgent: GeminiAiAgent,
  ) {}
  async courseScheduleAssistant(data: CourseScheduleAssistantProps) {
    const prompt = await this.generatePrompt(data);
    const text = await this.geminiAgent.ask(prompt);
    return text;
  }

  private async generatePrompt(data: CourseScheduleAssistantProps) {
    const { semesters, shifts = '1', periodsLength = 45 } = data;
    const allTeachers = await this.teacherService.find();
    const allCourse = await this.courseService.find({
      where: {
        semesterId: In(semesters.ids),
      },
    });
    const allTeachersUnavailability = await this.tUService.find();

    const prompt = `You are an expert University Routine Scheduler. Your goal is to generate a conflict-free, compact, and **visually balanced** Master Schedule for multiple semesters.

### INPUT VARIABLES:
- Shift Mode: ${shifts} (1 = Morning: 08:00-13:00, 2 = Afternoon: 13:20-18:00)
- Period Duration: ${periodsLength} minutes
- Date Range: ${semesters.start} to ${semesters.end}
- Days: Funday to Thursday

### STRICT HARD CONSTRAINTS:

1.  **Conflict-Free Guarantee:**
    - Teacher and Student exclusivity is absolute. No overlaps.

2.  **Course Distribution (The "Variety" Rule):**
    - **Theory:** Max 1 occurrence of a specific course code per day.
    - **Practical:** Max 1 block (3 periods) of a specific course code per day.
    - **Daily Composition:** Ideally, a day should contain a **MIX of Theory and Practical** (e.g., 3 Theory slots + 1 Practical block). Avoid days that are 100% Theory if Practical credits are available.

### OPTIMIZATION STRATEGY (The "Balance" Recipe):

**Step 1: The "See-Saw" Pattern (Crucial for Balance)**
- You must **ALTERNATE** the daily structure for each semester.
- **Pattern A (Theory First):** Schedule 2-3 Theory slots at the start -> Follow with 1 Practical Block at the end.
- **Pattern B (Practical First):** Schedule 1 Practical Block at the start -> Follow with 2-3 Theory slots.
- *Instruction:* If Funday is Pattern A, make Monday Pattern B. This ensures Practicals don't always happen at the same time every day.

**Step 2: The "Compact" Fill**
- **Fill Order:** Strictly from Shift Start -> Shift End.
- **Gap Control:** Do not leave gaps in the middle of the day. If a Semester starts late (e.g., 2nd period), ensure the periods run continuously until the end.

**Step 3: Workload Smoothing**
- Distribute "Heavy" days. Do not put the two hardest Practicals on consecutive days if possible.

### DATA:
- Semesters: ${JSON.stringify(semesters.ids)}
- Teachers: ${JSON.stringify(allTeachers)}
- Courses: ${JSON.stringify(allCourse)}
- Unavailability: ${JSON.stringify(allTeachersUnavailability)}

### OUTPUT:
Return ONLY a valid JSON array matching this schema:
[
  {
    "day": "String",
    "time_slot": "String",
    "course_code": "String",
    "teacher_id": "String",
    "semester_id": "String",
    "type": "Theory" | "Practical"
  }
]
`;

    return prompt;
  }
}
