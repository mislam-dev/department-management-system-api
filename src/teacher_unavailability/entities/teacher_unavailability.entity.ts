import { Teacher } from 'src/teacher/entities/teacher.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('teacher_unavailability')
@Index(['teacherId', 'startDatetime', 'startDatetime'])
export class TeacherUnavailability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teacherId: string;

  @ManyToOne(() => Teacher)
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @Column({ type: 'timestamptz' })
  startDatetime: Date;

  @Column({ type: 'timestamptz' })
  endDatetime: Date;

  @Column({ length: 255, nullable: true })
  reason: string;

  @Column({ default: true })
  isApproved: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
