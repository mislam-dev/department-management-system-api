import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { setTimeout } from 'timers/promises';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidLeadIDConstraint implements ValidatorConstraintInterface {
  async validate(leadId: string) {
    if (!leadId) return false;

    try {
      // todo user service with grpc to validate this user
      // const exists = await this.userService.findOne(leadId);
      // return !!exists;
      await setTimeout(0);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return 'studentId must be valid!';
  }
}
