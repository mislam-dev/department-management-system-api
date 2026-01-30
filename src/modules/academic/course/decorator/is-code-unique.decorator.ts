import { registerDecorator, ValidatorOptions } from 'class-validator';
import { IsCodeUniqueConstraints } from '../validator/is-code-unique.validator';

export function IsCodeUnique(options?: ValidatorOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      validator: IsCodeUniqueConstraints,
      propertyName,
      constraints: [],
      target: object.constructor,
      options,
    });
  };
}
