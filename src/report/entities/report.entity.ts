import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ReportType {
  ANALYTICS = 'ANALYTICS',
  PERFORMANCE = 'PERFORMANCE',
  ACTIVITY = 'ACTIVITY',
  SALES = 'SALES',
  FINANCIAL = 'FINANCIAL',
  USER = 'USER',
  SYSTEM = 'SYSTEM',
  ERROR = 'ERROR',
  EXPORT = 'EXPORT',
  CUSTOM = 'CUSTOM',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: ReportType,
  })
  type: ReportType;

  @CreateDateColumn({ type: 'timestamp' })
  generatedAt: Date;

  @Column({ nullable: true })
  filePath?: string;

  @Column({ nullable: true })
  parameters?: string;

  // RELATIONSHIP: Report.generatedBy → User.id
  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'generatedById' })
  generatedBy?: User;

  @Column({ nullable: true, type: 'uuid' })
  generatedById?: string;
}
