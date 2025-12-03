import { Notice } from 'src/notice/entities/notice.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'leadId' })
  lead: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
