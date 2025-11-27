import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';
import { Attendance } from '../entities/attendance.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueAttendanceConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(Attendance)
    private readonly repo: Repository<Attendance>,
  ) {}

  async validate(_: any, args: ValidationArguments) {
    const dto = args.object as CreateAttendanceDto;

    const exists = await this.repo.findOne({
      where: {
        studentId: dto.studentId,
        date: dto.date,
        courseScheduleId: dto.courseScheduleId,
        ...(dto.checkInTime ? { checkInTime: dto.checkInTime } : {}),
      },
    });

    return !exists;
  }

  defaultMessage(): string {
    return 'Attendance record already exists for this student, date, course schedule, and check-in time.';
  }
}
