import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  activityType: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  relatedEntityType?: string;

  @IsOptional()
  @IsUUID()
  relatedEntityId?: string;

  @IsOptional()
  @IsUUID()
  leadId?: string;
}
