import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemesterModule } from '../semester/semester.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { Course } from './entities/course.entity';
import { IsCodeUniqueConstraints } from './validator/is-code-unique.validator';

@Module({
  controllers: [CourseController],
  providers: [CourseService, IsCodeUniqueConstraints],
  imports: [TypeOrmModule.forFeature([Course]), SemesterModule],
  exports: [CourseService],
})
export class CourseModule {}
