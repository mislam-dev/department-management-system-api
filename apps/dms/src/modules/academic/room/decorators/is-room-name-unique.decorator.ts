import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsRoomNameUniqueConstraint } from '../validators/is-room-name-unique.validator';

export function IsRoomNameUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRoomNameUniqueConstraint,
    });
  };
}
