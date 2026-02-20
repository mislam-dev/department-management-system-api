import { Optional } from '@nestjs/common';
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @Optional()
  @IsBoolean()
  isRestricted: boolean;

  @IsNotEmpty()
  @IsUUID()
  memberId: string;

  @Optional()
  @IsString()
  name: string;
}
