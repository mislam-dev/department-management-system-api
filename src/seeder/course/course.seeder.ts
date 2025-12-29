import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/course/entities/course.entity';
import { Repository } from 'typeorm';
import { COURSES_SEED_DATA } from './course.data';

@Injectable()
export class CourseSeeder {
  private readonly logger = new Logger(CourseSeeder.name);

  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async seed() {
    this.logger.log('Started seeding courses...');

    for (const courseData of COURSES_SEED_DATA) {
      const existingCourse = await this.courseRepository.findOne({
        where: { code: courseData.code },
      });

      if (!existingCourse) {
        await this.courseRepository.save(
          this.courseRepository.create(courseData),
        );
      } else {
        // Optional: Update existing course data if needed
        // await this.courseRepository.update(existingCourse.id, courseData);
      }
    }

    this.logger.log(`Successfully seeded ${COURSES_SEED_DATA.length} courses.`);
  }
}
