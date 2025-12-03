import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { StudentService } from 'src/student/student.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidStudentIDConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly studentService: StudentService) {}

  async validate(studentId: string) {
    if (!studentId) return false;

    try {
      const exists = await this.studentService.findOne(studentId);
      return !!exists;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return 'studentId must be valid!';
  }
}
