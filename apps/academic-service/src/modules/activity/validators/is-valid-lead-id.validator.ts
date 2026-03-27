import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserServiceClient } from '../grpc/user-service.client';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidLeadIDConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserServiceClient) {}
  async validate(leadId: string) {
    if (!leadId) return false;

    try {
      const exists = await this.userService.getUserById(leadId);
      return !!exists;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return 'studentId must be valid!';
  }
}
