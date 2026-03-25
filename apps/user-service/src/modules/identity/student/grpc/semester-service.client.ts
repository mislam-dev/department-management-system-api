import {
  SEMESTER_PACKAGE_NAME,
  SEMESTER_SERVICE_NAME,
  SemesterServiceClient,
} from '@app/grpc/protos/semester';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export class GrpcSemesterServiceClient implements OnModuleInit {
  private logger = new Logger(GrpcSemesterServiceClient.name);
  private semesterService: SemesterServiceClient;

  constructor(
    @Inject(SEMESTER_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.semesterService = this.client.getService<SemesterServiceClient>(
      SEMESTER_SERVICE_NAME,
    );

    this.logger.log('Semester service client initialized');
  }

  async getSemesterById(semesterId: string) {
    const semester = await lastValueFrom(
      this.semesterService.getSemesterById({ id: semesterId }),
    );
    return semester;
  }
}
