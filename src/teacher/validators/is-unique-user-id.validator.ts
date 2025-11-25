import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
} from 'class-validator';
import { UserService } from 'src/user/user.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueUserConstraints implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(userId: string): Promise<boolean> {
    if (!userId) return false;
    try {
      // check if db has the user
      const user = await this.userService.findOne(userId);
      if (user) return false;

      return true;
    } catch {
      return true;
    }
  }
  defaultMessage?(): string {
    return `User is already exist!`;
  }
}

export function IsUserUnique(options?: ValidatorOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      validator: UniqueUserConstraints,
      constraints: [],
      options,
    });
  };
}
