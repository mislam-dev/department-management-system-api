import { Injectable } from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import { RoomService } from 'src/room/room.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { TeacherUnavailabilityService } from 'src/teacher_unavailability/teacher_unavailability.service';
import { In } from 'typeorm';
import { GeminiAiAgent } from './gemini.agent';

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
export class CourseScheduleAgent {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly courseService: CourseService,
    private readonly tUService: TeacherUnavailabilityService,
    private readonly geminiAgent: GeminiAiAgent,
    private readonly roomService: RoomService,
  ) {}
  async ask(data: CourseScheduleAssistantProps) {
    const prompt = await this.generatePrompt(data);
    const text = await this.geminiAgent.ask(prompt);
    return this.extractJSONString(text);
  }
  private extractJSONString(content: string): string {
    let data = '';
    try {
      // 1. Try direct parsing first
      data = JSON.stringify(JSON.parse(content));
    } catch {
      // 2. If it fails, use Regex to find the JSON block
      const jsonRegex = /({[\s\S]*})|(\[[\s\S]*\])/;
      const match = content.match(jsonRegex);

      if (match) {
        try {
          data = JSON.stringify(JSON.parse(match[0]));
        } catch {
          console.log('parse error');
        }
      }
    }
    return data;
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
    const allRooms = await this.roomService.findAll();

    const prompt = `You are an expert University Routine Scheduler. Your goal is to generate a conflict-free, compact, and **visually balanced** Master Schedule for multiple semesters, accounting for Teacher, Student, and Room availability.
  
  ### INPUT VARIABLES:
  - Shift Mode: ${shifts} (1 = Morning: 08:00-13:00, 2 = Afternoon: 13:20-18:00)
  - Period Duration: ${periodsLength} minutes
  - Date Range: ${semesters.start} to ${semesters.end}
  - Days: Funday to Thursday
  
  ### STRICT HARD CONSTRAINTS:
  
  1.  **Conflict-Free Guarantee:**
      - **Teacher exclusivity:** No teacher can be in two places at once.
      - **Student exclusivity:** No semester group can have two overlapping classes.
      - **Room exclusivity:** No room can be assigned to more than one course at the same time.
  
  2.  **Room Type & Capacity Matching:**
      - **Theory** courses must be assigned to rooms with type "classroom".
      - **Practical** courses should ideally be assigned to rooms with type "lab" or "workshop" (if available in data), otherwise "classroom".
      - Ensure the room capacity is sufficient for the semester's student count.

  3.  **Course Distribution (The "Variety" Rule):**
      - **Theory:** Max 1 occurrence of a specific course code per day.
      - **Practical:** Max 1 block (3 periods) of a specific course code per day.
      - **Daily Composition:** Ideally, a day should contain a **MIX of Theory and Practical**. Avoid days that are 100% Theory if Practical credits are available.
  
  ### OPTIMIZATION STRATEGY:
  
  **Step 1: The "See-Saw" Pattern**
  - **ALTERNATE** the daily structure: 
    - Pattern A: Theory (Start) -> Practical (End).
    - Pattern B: Practical (Start) -> Theory (End).
  
  **Step 2: The "Compact" Fill**
  - Fill Order: Strictly from Shift Start -> Shift End. No gaps in the middle of a semester's day.

  **Step 3: Room Optimization**
  - Try to keep a specific Semester in the same room for all "Theory" classes on a given day to minimize student movement.
  
  ### DATA:
  - Semesters: ${JSON.stringify(semesters.ids)}
  - Teachers: ${JSON.stringify(allTeachers)}
  - Courses: ${JSON.stringify(allCourse)}
  - Rooms: ${JSON.stringify(allRooms)}
  - Unavailability: ${JSON.stringify(allTeachersUnavailability)}
  
  ### OUTPUT:
  Return ONLY a valid JSON array matching this schema:
  [
    {
      "day": "String",
      "time_start": "String",
      "time_end": "String",
      "course_id": "String",
      "teacher_id": "String",
      "semester_id": "String",
      "room_id": "String",
      "type": "Theory" | "Practical"
    }
  ]
  `;

    return prompt;
  }
}
