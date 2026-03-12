import { Validate } from 'class-validator';
import { IsValidStudentIDConstraint } from '../validators/is-valid-student-id.validator';

export function IsValidStudentId() {
  return Validate(IsValidStudentIDConstraint);
}
