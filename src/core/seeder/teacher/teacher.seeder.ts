// src/database/seeds/teacher.seed.ts
import { Injectable, Logger } from '@nestjs/common';
import { TeacherService } from '../../../modules/identity/teacher/teacher.service';
import { UserService } from '../../../modules/identity/user/user.service';
import { TEACHERS_SEED_DATA } from './teacher.data';

@Injectable()
export class TeacherSeeder {
  private readonly logger = new Logger(TeacherSeeder.name);

  constructor(
    private readonly teacherService: TeacherService,
    private readonly userService: UserService,
  ) {}

  async seed() {
    this.logger.log('Started seeding teachers...');

    for (const dto of TEACHERS_SEED_DATA) {
      try {
        await this.userService.findByEmail(dto.email);
        this.logger.debug(`Skipping ${dto.fullName} (already exists)`);
      } catch {
        await this.teacherService.create(dto);
        this.logger.log(`Created teacher: ${dto.fullName}`);
      }
    }

    this.logger.log('Teacher seeding completed.');
  }
}
