import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateCourseScheduleDto } from '../dto/create-course_schedule.dto';

@ValidatorConstraint({ async: false })
@Injectable()
export class IsValidTimeRangeConstraint
  implements ValidatorConstraintInterface
{
  validate(_: any, args: ValidationArguments): boolean {
    const dto = args.object as CreateCourseScheduleDto;

    if (!dto.startTime || !dto.endTime) return true; // other validators will catch missing values

    const start = dto.startTime;
    const end = dto.endTime;

    return start < end;
  }

  defaultMessage(): string {
    return 'startTime must be earlier than endTime.';
  }
}
