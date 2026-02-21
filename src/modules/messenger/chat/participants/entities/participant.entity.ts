import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Conversation } from '../../conversation/entities/conversation.entity';

export enum ParticipantRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

@Entity('participants')
@Index(['userId', 'conversationId'], { unique: true })
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  conversationId: string;

  @Column({
    type: 'enum',
    enum: ParticipantRole,
    default: ParticipantRole.MEMBER,
  })
  role: ParticipantRole;

  @Column({ type: 'timestamp', nullable: true })
  lastReadAt: Date;

  @ManyToOne(() => Conversation, (conversation) => conversation.participants)
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;
}
