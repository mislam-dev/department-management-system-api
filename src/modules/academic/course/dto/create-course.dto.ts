import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { IsValidSemesterId } from 'src/modules/academic/semester/decorator/is-valid-semester-id.decorator';
import { IsCodeUnique } from '../decorator/is-code-unique.decorator';

export class CreateCourseDto {
  @IsUUID()
  @IsValidSemesterId()
  semesterId: string;

  @IsString()
  @MinLength(3)
  @IsCodeUnique()
  code: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  credits: number;

  @IsInt()
  theoryCredits: number;

  @IsInt()
  practicalCredits: number;
}
