import { IsDateString, IsString } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class CreateTeacherDto extends CreateUserDto {
  @IsDateString()
  joinDate: string;

  @IsString()
  officeLocation: string;
}
