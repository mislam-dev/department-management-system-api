import {
  STUDENT_PACKAGE_NAME,
  STUDENT_SERVICE_NAME,
  StudentServiceClient,
} from '@app/grpc/protos/student';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export class GrpcStudentServiceClient implements OnModuleInit {
  private logger = new Logger(GrpcStudentServiceClient.name);
  private studentService: StudentServiceClient;

  constructor(
    @Inject(STUDENT_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.studentService =
      this.client.getService<StudentServiceClient>(STUDENT_SERVICE_NAME);

    this.logger.log('Student service client initialized');
  }

  async getStudentById(studentId: string) {
    const student = await lastValueFrom(
      this.studentService.getStudentById({ studentId }),
    );
    return student;
  }
}
