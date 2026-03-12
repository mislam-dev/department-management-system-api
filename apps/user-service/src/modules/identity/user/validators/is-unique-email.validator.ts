import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidatorOptions,
} from 'class-validator';
import { UserService } from '../user.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueEmailConstraints implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(email: string): Promise<boolean> {
    if (!email) return false;
    try {
      // check if db has the user
      const user = await this.userService.findByEmail(email);
      if (user) return false;

      // check if user is exist on auth0
      // const auth0User = await this.auth0Service.getUserByEmail(email);
      // if (auth0User) return false;
      // todo check user exist on auth0

      return true;
    } catch {
      return true;
    }
  }
  defaultMessage?(): string {
    return `Email is already exist!`;
  }
}

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
