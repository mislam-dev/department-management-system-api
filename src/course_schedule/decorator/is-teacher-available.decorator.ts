import { Validate } from 'class-validator';
import { IsTeacherAvailableConstraint } from '../validators/is-teacher-available.validator';

export function IsTeacherAvailable() {
  return Validate(IsTeacherAvailableConstraint);
}
