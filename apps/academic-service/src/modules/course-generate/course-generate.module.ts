import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AiModule } from '../../../common/ai/ai.module';
import { AiModule } from '@app/ai';
import { CourseGenerateConsumer } from './consumers/course-generate.consumer';
import { CourseGenerateController } from './course-generate.controller';
import { CourseGenerateService } from './course-generate.service';
import { COURSE_SCHEDULE_QUEUE } from './course-schedule.constants';
import { CourseGenerate } from './entities/course-generate.entity';

@Module({
  controllers: [CourseGenerateController],
  providers: [CourseGenerateService, CourseGenerateConsumer],
  imports: [
    AiModule,
    TypeOrmModule.forFeature([CourseGenerate]),
    BullModule.registerQueue({
      name: COURSE_SCHEDULE_QUEUE,
    }),
  ],
})
export class CourseGenerateModule {}
