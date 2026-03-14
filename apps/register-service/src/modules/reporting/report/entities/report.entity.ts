import {
  Column,
  CreateDateColumn,
  Entity,
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
  @Column({ nullable: true, type: 'uuid' })
  generatedById?: string;
}
