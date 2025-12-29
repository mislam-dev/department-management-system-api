import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { TeacherModule } from 'src/teacher/teacher.module';
import { UserModule } from 'src/user/user.module';
import { CourseSeeder } from './course/course.seeder';
import { TeacherSeeder } from './teacher/teacher.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), TeacherModule, UserModule],
  providers: [CourseSeeder, TeacherSeeder],
  exports: [CourseSeeder, TeacherSeeder], // Export if you use it in other modules
})
export class SeederModule {}
