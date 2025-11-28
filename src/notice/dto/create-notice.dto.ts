import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNoticeDto {
  @IsUUID(undefined, { message: 'createdById must be a validate UUID' })
  createdById: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  attachment?: string;
}
