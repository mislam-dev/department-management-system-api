// seed.ts (standalone script example)
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { CourseSeeder } from './course/course.seeder';
import { TeacherSeeder } from './teacher/teacher.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // Get the seeder service from the app context
  const courseSeeder = app.get(CourseSeeder);
  const teacherSeeder = app.get(TeacherSeeder);

  try {
    await teacherSeeder.seed();
    await courseSeeder.seed();
  } catch (error) {
    console.error('Seeding failed', error);
  } finally {
    await app.close();
  }
}

bootstrap();
