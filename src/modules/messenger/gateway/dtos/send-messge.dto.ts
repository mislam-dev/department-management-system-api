import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class MessageBodyDto {
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
