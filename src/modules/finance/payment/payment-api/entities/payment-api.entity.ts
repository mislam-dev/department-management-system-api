import { Fee } from 'src/modules/finance/fee/entities/fee.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  PROGRESS = 'progress',
  SUCCESSFULL = 'successfull',
  FAILED = 'failed',
}

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  feesId: string;

  @ManyToOne(() => Fee)
  @JoinColumn({ name: 'feesId' })
  fee: Fee;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: 'text', nullable: true })
  extra: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column()
  provider: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
