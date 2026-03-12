import { PickType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends PartialType(
  PickType(CreateStudentDto, [
    'currentSemesterId',
    'enrolmentDate',
    'graduationYear',
    'session',
    'status',
  ]),
) {}
