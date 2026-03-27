import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { GrpcSemesterServiceClient } from '../grpc/semester-service.client';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidSemesterIdConstraints
  implements ValidatorConstraintInterface
{
  constructor(private readonly semesterService: GrpcSemesterServiceClient) {}
  async validate(semesterId: string): Promise<boolean> {
    if (!semesterId) return false;
    try {
      const findSemester =
        await this.semesterService.getSemesterById(semesterId);
      return !!findSemester;
    } catch {
      return false;
    }
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} must be a valid semester id`;
  }
}
