import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsOptional()
  @IsBoolean()
  isRestricted: boolean;

  @IsUUID()
  memberId: string;

  @IsOptional()
  @IsString()
  name: string;
}
