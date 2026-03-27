import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { GrpcCourseScheduleServiceClient } from '../grpc/course-schedule.client';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidCourseScheduleIdConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    private readonly grpcCourseScheduleServiceClient: GrpcCourseScheduleServiceClient,
  ) {}
  async validate(courseScheduleId: string) {
    if (!courseScheduleId) return false;

    try {
      const exists =
        await this.grpcCourseScheduleServiceClient.getCourseScheduleById(
          courseScheduleId,
        );
      return !!exists;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return 'courseScheduleId must be valid!';
  }
}
