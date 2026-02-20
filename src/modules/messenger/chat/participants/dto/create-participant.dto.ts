import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ParticipantRole } from '../entities/participant.entity';

export class CreateParticipantDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  @IsOptional()
  @IsEnum(ParticipantRole)
  role?: ParticipantRole;
}
