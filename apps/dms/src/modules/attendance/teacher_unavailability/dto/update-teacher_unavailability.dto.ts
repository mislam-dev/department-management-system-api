import { PartialType } from '@nestjs/swagger';
import { CreateTeacherUnavailabilityDto } from './create-teacher_unavailability.dto';

export class UpdateTeacherUnavailabilityDto extends PartialType(
  CreateTeacherUnavailabilityDto,
) {}
