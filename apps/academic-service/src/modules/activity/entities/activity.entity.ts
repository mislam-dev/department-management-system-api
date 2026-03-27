import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Notice } from '../../notice/entities/notice.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  activityType: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  relatedEntityType?: string;

  @Column({ nullable: true })
  relatedEntityId?: string;

  @Column({ nullable: true })
  leadId?: string;

  @ManyToOne(() => Notice, (n) => n.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'relatedEntityId' })
  relatedEntity: Notice;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
