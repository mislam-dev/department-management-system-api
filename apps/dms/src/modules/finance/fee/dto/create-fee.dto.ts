import { IsEnum, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { FeeStatus, FeeType } from '../entities/fee.entity';

export class CreateFeeDto {
  @IsOptional()
  @IsEnum(FeeType)
  type: FeeType;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  session: string;

  @IsInt()
  total: number;

  @IsInt()
  @IsOptional()
  charge: number;

  @IsInt()
  sub_total: number;

  @IsUUID()
  studentId: string;

  @IsUUID()
  semesterId: string;

  @IsOptional()
  @IsEnum(FeeStatus)
  status?: FeeStatus;
}
