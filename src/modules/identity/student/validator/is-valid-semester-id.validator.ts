import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SemesterService } from 'src/modules/academic/semester/semester.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidSemesterIdConstraints
  implements ValidatorConstraintInterface
{
  constructor(private readonly semesterService: SemesterService) {}
  async validate(semesterId: string): Promise<boolean> {
    if (!semesterId) return false;
    try {
      const findSemester = await this.semesterService.findOne(semesterId);
      if (findSemester) return true;
      return false;
    } catch {
      return false;
    }
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} must be a valid semester id`;
  }
}
