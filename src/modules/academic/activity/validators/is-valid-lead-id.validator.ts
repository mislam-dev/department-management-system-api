import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from 'src/modules/identity/user/user.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidLeadIDConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}

  async validate(leadId: string) {
    if (!leadId) return false;

    try {
      const exists = await this.userService.findOne(leadId);
      return !!exists;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return 'studentId must be valid!';
  }
}
