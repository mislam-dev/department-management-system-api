import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CourseScheduleService } from 'src/course_schedule/course_schedule.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidCourseScheduleIdConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly courseSchedule: CourseScheduleService) {}

  async validate(courseScheduleId: string) {
    if (!courseScheduleId) return false;

    try {
      const exists = await this.courseSchedule.findOne(courseScheduleId);
      return !!exists;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  defaultMessage(): string {
    return 'courseScheduleId must be valid!';
  }
}
