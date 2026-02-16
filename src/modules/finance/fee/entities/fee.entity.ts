import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum FeeType {
  REGISTRATION = 'registration',
  SESSION = 'session',
  CERTIFICATES = 'certificates',
  EXAM_RECALL = 'exam_recall',
  ADMISSION = 'admission',
  OTHERS = 'others',
}

export enum FeeStatus {
  PENDING = 'pending',
  PROGRESS = 'progress',
  PAID = 'paid',
  FAILED = 'failed',
  HOLD = 'hold',
  DECLINED = 'declined',
  DELETED = 'deleted',
}

@Entity({ name: 'fees' })
export class Fee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: FeeType,
    default: FeeType.OTHERS,
  })
  type: FeeType;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'integer' })
  total: number;

  @Column({ type: 'integer', default: 0, nullable: true })
  charge: number;

  @Column({ type: 'integer' })
  sub_total: number;

  @Column({ type: 'uuid' })
  studentId: string;

  @Column()
  session: string;

  @Column({ type: 'uuid' })
  semesterId: string;

  @Column({
    type: 'enum',
    enum: FeeStatus,
    default: FeeStatus.PENDING,
  })
  status: FeeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
