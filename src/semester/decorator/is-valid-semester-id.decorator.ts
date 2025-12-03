import { registerDecorator, ValidatorOptions } from 'class-validator';
import { IsValidSemesterIdConstraints } from '../validator/is-valid-semester-id.validator';

export function IsValidSemesterId(options?: ValidatorOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      validator: IsValidSemesterIdConstraints,
      propertyName,
      constraints: [],
      target: object.constructor,
      options,
    });
  };
}
