import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { CourseSeeder } from './course/course.seeder';
import { RoomSeeder } from './room/room.seeder';
import { TeacherSeeder } from './teacher/teacher.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // Get the seeder service from the app context
  const courseSeeder = app.get(CourseSeeder);
  const teacherSeeder = app.get(TeacherSeeder);
  const roomSeeder = app.get(RoomSeeder);

  try {
    await teacherSeeder.seed();
    await courseSeeder.seed();
    await roomSeeder.seed();
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await app.close();
  }
}

void bootstrap();
