import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Designation, type DesignationType } from '../entities/user.entity';
import { IsEmailNotDummy } from '../validators/is-email-not-dummy.validator';
import { IsEmailUnique } from '../validators/is-unique-email.validator';

export class CreateUserDto {
  @IsEmail()
  @IsEmailNotDummy()
  @IsEmailUnique()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEnum(Designation)
  designation: DesignationType;

  @IsString()
  @MinLength(6)
  password: string;
}
