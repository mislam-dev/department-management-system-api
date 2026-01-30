import { Validate } from 'class-validator';
import { IsValidTimeRangeConstraint } from '../validators/is-valid-time-range.validator';

export function IsValidTimeRange() {
  return Validate(IsValidTimeRangeConstraint);
}
