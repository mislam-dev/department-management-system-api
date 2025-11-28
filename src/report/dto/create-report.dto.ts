import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ReportType } from '../entities/report.entity';

export class CreateReportDto {
  @IsString()
  title: string;

  @IsEnum(ReportType)
  type: ReportType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  parameters?: string;

  @IsOptional()
  @IsUUID()
  generatedById?: string;
}
