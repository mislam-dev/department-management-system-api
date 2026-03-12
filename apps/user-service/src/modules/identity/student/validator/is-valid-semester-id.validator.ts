import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { setTimeout } from 'timers/promises';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidSemesterIdConstraints
  implements ValidatorConstraintInterface
{
  async validate(semesterId: string): Promise<boolean> {
    if (!semesterId) return false;
    try {
      // todo: check semester exist on semester service
      // const findSemester = await this.semesterService.findOne(semesterId);
      // if (findSemester) return true;
      // return false;
      await setTimeout(0); // todo remove on production
      return true;
    } catch {
      return false;
    }
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} must be a valid semester id`;
  }
}
