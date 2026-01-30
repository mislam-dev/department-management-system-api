import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTeacherUnavailabilityDto {
  @IsNotEmpty()
  @IsDateString()
  startDatetime: string;

  @IsNotEmpty()
  @IsDateString()
  endDatetime: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;

  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}
