import { Body, Controller, Post } from '@nestjs/common';
import { CourseGenerateService } from './course-generate.service';
import { CourseGenerateDto } from './dto/create-course-generate.dto';

@Controller('course-generate')
export class CourseGenerateController {
  constructor(private readonly courseGenerateService: CourseGenerateService) {}

  @Post()
  create(@Body() dto: CourseGenerateDto) {
    return this.courseGenerateService.generate(dto);
  }
}
