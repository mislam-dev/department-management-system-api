import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFaceApiDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
