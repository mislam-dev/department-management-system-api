import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Auth0Service } from '../auth0.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueEmailConstraints implements ValidatorConstraintInterface {
  constructor(private readonly auth0Service: Auth0Service) {}

  async validate(email: string): Promise<boolean> {
    if (!email) return false;
    try {
      // check if user is exist on auth0
      console.log(email);
      const auth0User = await this.auth0Service.getUserByEmail(email);
      if (auth0User) return false;
      return true;
    } catch {
      return true;
    }
  }
  defaultMessage?(): string {
    return `Email is already exist!`;
  }
}
