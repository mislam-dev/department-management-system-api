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

function timesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string,
): boolean {
  return startA < endB && startB < endA;
}
@ValidatorConstraint({ async: true })
@Injectable()
export class HasNoScheduleOverlapConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(CourseSchedule)
    private readonly repo: Repository<CourseSchedule>,
  ) {}

  async validate(_: any, args: ValidationArguments) {
    const dto = args.object as CreateCourseScheduleDto & { courseId: string };

    const schedules = await this.repo.find({
      where: {
        courseId: dto.courseId,
        dayOfWeek: dto.dayOfWeek,
      },
    });

    return !schedules.some((schedule) =>
      timesOverlap(
        dto.startTime,
        dto.endTime,
        schedule.startTime,
        schedule.endTime,
      ),
    );
  }

  defaultMessage(): string {
    return 'This course already has a schedule that overlaps with this time.';
  }
}
