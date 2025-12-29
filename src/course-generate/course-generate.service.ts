import { Injectable } from '@nestjs/common';
import { AiService } from 'src/ai/ai.service';
import { CourseGenerateDto } from './dto/create-course-generate.dto';

@Injectable()
export class CourseGenerateService {
  constructor(private readonly aiService: AiService) {}
  async generate(dto: CourseGenerateDto) {
    const data = await this.aiService.courseScheduleAssistant({
      semesters: {
        start: dto.semesterStart,
        end: dto.semesterEnd,
        ids: dto.semesterIds,
      },
    });

    return data;
  }
}
