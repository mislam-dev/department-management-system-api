// get-resource-query.dto.ts
import { IsString } from 'class-validator';
import { IsValidTeacherId } from '../decorator/is-valid-teacher-id.decorator';

export class ResourceParamDto {
  @IsString()
  @IsValidTeacherId()
  teacherId: string;
}
