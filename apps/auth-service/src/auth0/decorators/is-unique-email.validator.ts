import { registerDecorator, ValidatorOptions } from 'class-validator';
import { UniqueEmailConstraints } from '../validators/is-unique-email.validator';

export function IsEmailUnique(options?: ValidatorOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      validator: UniqueEmailConstraints,
      constraints: [],
      options,
    });
  };
}
