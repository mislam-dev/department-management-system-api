import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { RoomModule } from 'src/room/room.module';
import { TeacherModule } from 'src/teacher/teacher.module';
import { UserModule } from 'src/user/user.module';
import { CourseSeeder } from './course/course.seeder';
import { RoomSeeder } from './room/room.seeder';
import { TeacherSeeder } from './teacher/teacher.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    TeacherModule,
    UserModule,
    RoomModule,
  ],
  providers: [CourseSeeder, TeacherSeeder, RoomSeeder],
  exports: [CourseSeeder, TeacherSeeder], // Export if you use it in other modules
})
export class SeederModule {}
