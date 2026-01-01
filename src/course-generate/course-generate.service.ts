import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AiService } from 'src/ai/ai.service';
import { Repository } from 'typeorm';
import { CourseGenerateDto } from './dto/create-course-generate.dto';
import { CourseGenerate } from './entities/course-generate.entity';

@Injectable()
export class CourseGenerateService {
  constructor(
    @InjectRepository(CourseGenerate)
    private readonly repo: Repository<CourseGenerate>,
    private readonly aiService: AiService,
  ) {}
  async generate(dto: CourseGenerateDto) {
    const data = await this.aiService.courseScheduleAssistant({
      semesters: {
        start: dto.semesterStart,
        end: dto.semesterEnd,
        ids: dto.semesterIds,
      },
    });
    const save = this.repo.create({ data });
    const savedData = await this.repo.save(save);
    return savedData;
  }
}
