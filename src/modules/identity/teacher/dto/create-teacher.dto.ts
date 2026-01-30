import { IsDateString, IsString } from 'class-validator';
import { CreateUserDto } from 'src/modules/identity/user/dto/create-user.dto';

export class CreateTeacherDto extends CreateUserDto {
  @IsDateString()
  joinDate: string;

  @IsString()
  officeLocation: string;
}
