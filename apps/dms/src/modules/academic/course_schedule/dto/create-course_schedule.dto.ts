import { IsOptional, IsString, IsUUID, Matches } from 'class-validator';
import { HasNoScheduleOverlap } from '../decorator/has-no-schedule-overlap.decorator';
import { IsRoomAvailable } from '../decorator/is-room-available.decorator';
import { IsTeacherAvailable } from '../decorator/is-teacher-available.decorator';
import { IsUniqueSchedule } from '../decorator/is-teacher-available.decorator copy';
import { IsValidTimeRange } from '../decorator/is-valid-time-range.decorator';

export class CreateCourseScheduleDto {
  @IsUniqueSchedule()
  @IsString()
  dayOfWeek: string;

  @Matches(/^\d{2}:\d{2}$/, {
    message: 'startTime must be in HH:MM format',
  })
  @HasNoScheduleOverlap()
  @IsValidTimeRange()
  startTime: string;

  @Matches(/^\d{2}:\d{2}$/, {
    message: 'endTime must be in HH:MM format',
  })
  endTime: string;

  @IsString()
  @IsRoomAvailable()
  room: string;

  @IsOptional()
  @IsUUID(undefined, { message: 'Teacher ID must be a valid UUID' })
  @IsTeacherAvailable()
  teacherId?: string;
}
