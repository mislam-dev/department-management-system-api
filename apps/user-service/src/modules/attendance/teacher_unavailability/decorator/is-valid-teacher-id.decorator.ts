import { registerDecorator, ValidatorOptions } from 'class-validator';
import { ValidTeacherIdConstraints } from '../validators/is-valid-teacher-id.validator';

export function IsValidTeacherId(options?: ValidatorOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      validator: ValidTeacherIdConstraints,
      constraints: [],
      options,
    });
  };
}
