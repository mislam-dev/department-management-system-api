import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { TeacherService } from 'src/modules/identity/teacher/teacher.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ValidTeacherIdConstraints implements ValidatorConstraintInterface {
  constructor(private readonly teacherService: TeacherService) {}
  async validate(teacherId: string): Promise<boolean> {
    if (!teacherId) return false;
    try {
      await this.teacherService.findOne(teacherId);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} is not valid!`;
  }
}
