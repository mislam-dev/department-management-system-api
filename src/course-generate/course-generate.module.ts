import { Module } from '@nestjs/common';
import { AiModule } from 'src/ai/ai.module';
import { CourseGenerateController } from './course-generate.controller';
import { CourseGenerateService } from './course-generate.service';

@Module({
  controllers: [CourseGenerateController],
  providers: [CourseGenerateService],
  imports: [AiModule],
})
export class CourseGenerateModule {}
