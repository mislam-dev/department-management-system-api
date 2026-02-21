import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateGroupConversationDto {
  @IsOptional()
  @IsBoolean()
  isRestricted: boolean;

  @IsArray()
  @IsUUID('all', { each: true })
  members: string[];

  @IsString()
  name: string;
}
