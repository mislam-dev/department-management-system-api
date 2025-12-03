import { Validate } from 'class-validator';
import { IsValidCourseScheduleIdConstraint } from '../validators/is-valid-course-schedule-id.validator';

export function IsValidCourseScheduleId() {
  return Validate(IsValidCourseScheduleIdConstraint);
}
