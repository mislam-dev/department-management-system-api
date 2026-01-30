import { Validate } from 'class-validator';
import { HasNoScheduleOverlapConstraint } from '../validators/has-no-schedule-overlap.validator';

export function HasNoScheduleOverlap() {
  return Validate(HasNoScheduleOverlapConstraint);
}
