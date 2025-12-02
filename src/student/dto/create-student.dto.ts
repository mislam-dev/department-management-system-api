import { PickType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IsValidSemesterId } from '../decorator/is-valid-semester-id.decorator';
import { StudentStatus } from '../entities/student.entity';

export class CreateStudentDto extends PickType(CreateUserDto, [
  'email',
  'password',
  'fullName',
]) {
  @IsDateString()
  enrolmentDate: string;

  @IsOptional()
  @IsEnum(StudentStatus)
  status?: StudentStatus;

  @IsString()
  session?: string;

  @IsOptional()
  @IsInt()
  graduationYear?: number;

  @IsUUID(undefined, { message: 'Current Semester Id must be valid!' })
  @IsValidSemesterId()
  currentSemesterId: string;
}
