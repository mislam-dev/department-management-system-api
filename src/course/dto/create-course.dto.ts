import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateCourseDto {
  @IsUUID()
  semesterId: string;

  @IsString()
  @MinLength(3)
  code: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  credits: number;
}
