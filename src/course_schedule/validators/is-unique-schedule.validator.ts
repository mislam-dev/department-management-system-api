import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { CreateCourseScheduleDto } from '../dto/create-course_schedule.dto';
import { CourseSchedule } from '../entities/course_schedule.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueScheduleConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(CourseSchedule)
    private readonly scheduleRepo: Repository<CourseSchedule>,
  ) {}

  async validate(value: any, args: ValidationArguments) {
    const dto = args.object as CreateCourseScheduleDto & { courseId: string };

    const exists = await this.scheduleRepo.findOne({
      where: {
        courseId: dto.courseId,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
        room: dto.room ?? null,
        ...(dto.teacherId ? { teacherId: dto.teacherId } : {}),
      },
    });

    return !exists; // valid only if record doesn't exist
  }

  defaultMessage() {
    return 'A schedule with the same course, day, time, room, and teacher already exists.';
  }
}
