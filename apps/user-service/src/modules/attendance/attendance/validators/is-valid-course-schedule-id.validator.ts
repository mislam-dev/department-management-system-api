import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { setTimeout } from 'timers/promises';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidCourseScheduleIdConstraint
  implements ValidatorConstraintInterface
{
  async validate(courseScheduleId: string) {
    if (!courseScheduleId) return false;

    try {
      // TODO: implement this via grpc
      // const exists = await this.courseSchedule.findOne(courseScheduleId);
      // return !!exists;
      await setTimeout(0);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  defaultMessage(): string {
    return 'courseScheduleId must be valid!';
  }
}
