import {
  COURSE_SCHEDULE_PACKAGE_NAME,
  COURSE_SCHEDULE_SERVICE_NAME,
  CourseScheduleServiceClient,
} from '@app/grpc/protos/course/course-schedule';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export class GrpcCourseScheduleServiceClient implements OnModuleInit {
  private logger = new Logger(GrpcCourseScheduleServiceClient.name);
  private courseScheduleService: CourseScheduleServiceClient;

  constructor(
    @Inject(COURSE_SCHEDULE_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.courseScheduleService =
      this.client.getService<CourseScheduleServiceClient>(
        COURSE_SCHEDULE_SERVICE_NAME,
      );
    this.logger.log('Course schedule service client initialized');
  }

  async getCourseScheduleById(id: string) {
    const courseSchedule = await lastValueFrom(
      this.courseScheduleService.getCourseScheduleById({
        id,
      }),
    );
    return courseSchedule;
  }
}
