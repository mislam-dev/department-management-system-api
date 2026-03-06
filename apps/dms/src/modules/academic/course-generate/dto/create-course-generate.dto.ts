import { IsArray, IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';

export class CourseGenerateDto {
  @IsArray()
  @IsUUID('4', { each: true }) // Ensures every item inside the array is a string
  @IsNotEmpty()
  semesterIds: string[];

  @IsISO8601()
  @IsNotEmpty()
  semesterStart: string;

  @IsISO8601()
  @IsNotEmpty()
  semesterEnd: string;
}
