import { IsString } from 'class-validator';

export class CreateSemesterDto {
  @IsString()
  name: string;
}
