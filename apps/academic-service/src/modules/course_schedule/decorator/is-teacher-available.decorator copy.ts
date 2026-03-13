import { Validate } from 'class-validator';
import { IsUniqueScheduleConstraint } from '../validators/is-unique-schedule.validator';

export function IsUniqueSchedule() {
  return Validate(IsUniqueScheduleConstraint);
}
