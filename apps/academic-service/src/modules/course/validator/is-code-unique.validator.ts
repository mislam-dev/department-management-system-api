import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CourseService } from '../course.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsCodeUniqueConstraints implements ValidatorConstraintInterface {
  constructor(private readonly courseService: CourseService) {}
  async validate(code: string): Promise<boolean> {
    if (!code) return false;
    try {
      const findCourseWithCode = await this.courseService.findOneBy({
        where: { code },
      });
      if (findCourseWithCode) return false;
      return true;
    } catch {
      return true;
    }
  }
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} is already exist!`;
  }
}
