import { Validate } from 'class-validator';
import { IsUniqueAttendanceConstraint } from '../validators/is-unique-attendance.validator';

export function IsUniqueAttendance() {
  return Validate(IsUniqueAttendanceConstraint);
}
