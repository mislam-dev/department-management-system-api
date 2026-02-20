import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Participant } from '../../participants/entities/participant.entity';

export enum ConversationType {
  P2P = 'P2P',
  GROUP = 'GROUP',
}

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ConversationType,
    default: ConversationType.P2P,
  })
  type: ConversationType;

  @Column({ nullable: true })
  name: string;

  @Column({ default: false })
  isRestricted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Participant, (participant) => participant.conversationId)
  participants: Participant[];
}
