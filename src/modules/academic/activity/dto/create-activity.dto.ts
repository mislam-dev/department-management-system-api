import { IsOptional, IsString, IsUUID } from 'class-validator';
import { IsValidLeadID } from '../decorators/is-valid-lead-id.decorator';
import { IsValidRelatedEntityID } from '../decorators/is-valid-student-id.decorator';

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
  @IsValidRelatedEntityID()
  relatedEntityId?: string;

  @IsOptional()
  @IsUUID()
  @IsValidLeadID()
  leadId?: string;
}
