import { Auth0CreateUserDto } from '@app/grpc/protos/auth0';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsEmailUnique } from '../decorators/is-unique-email.validator';

export class CreateUserDto implements Auth0CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsEmailUnique()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 character' })
  name: string;
}
