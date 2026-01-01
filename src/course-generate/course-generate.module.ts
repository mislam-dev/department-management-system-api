import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from 'src/ai/ai.module';
import { CourseGenerateController } from './course-generate.controller';
import { CourseGenerateService } from './course-generate.service';
import { CourseGenerate } from './entities/course-generate.entity';

@Module({
  controllers: [CourseGenerateController],
  providers: [CourseGenerateService],
  imports: [AiModule, TypeOrmModule.forFeature([CourseGenerate])],
})
export class CourseGenerateModule {}
