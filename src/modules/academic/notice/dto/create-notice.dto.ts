import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateNoticeDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  attachment?: string;
}
