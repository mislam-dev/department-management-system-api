import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicServiceController } from './academic-service.controller';
import { AcademicServiceService } from './academic-service.service';
import { ConfigModule } from './core/config/config.module';
import { ActivityModule } from './modules/activity/activity.module';
import { CourseGenerateModule } from './modules/course-generate/course-generate.module';
import { CourseModule } from './modules/course/course.module';
import { CourseScheduleModule } from './modules/course_schedule/course_schedule.module';
import { NoticeModule } from './modules/notice/notice.module';
import { RoomModule } from './modules/room/room.module';
import { SemesterModule } from './modules/semester/semester.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.getOrThrow<string>('database.host'),
          port: config.getOrThrow<number>('database.port'),
          username: config.getOrThrow<string>('database.username'),
          password: config.getOrThrow<string>('database.password'),
          database: config.getOrThrow<string>('database.name'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          connection: {
            host: config.get<string>('bull.host'),
            port: config.get<number>('bull.port'),
          },
        };
      },
      inject: [ConfigService],
    }),
    ActivityModule,
    CourseModule,
    CourseScheduleModule,
    CourseGenerateModule,
    NoticeModule,
    RoomModule,
    SemesterModule,
  ],
  controllers: [AcademicServiceController],
  providers: [AcademicServiceService],
})
export class AcademicServiceModule {}
