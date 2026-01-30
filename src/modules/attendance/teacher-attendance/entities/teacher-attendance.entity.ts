import { Teacher } from 'src/modules/identity/teacher/entities/teacher.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
  HALF_DAY = 'HALF_DAY',
  ON_LEAVE = 'ON_LEAVE',
}

@Entity('teacher-attendance')
@Unique('UQ_teacher_id_date_time', ['teacherId', 'dateTime'])
export class TeacherAttendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  teacherId: string;

  @CreateDateColumn({ type: 'timestamp' })
  dateTime: Date;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'uuid', nullable: true })
  recordedById?: string;

  @ManyToOne(() => Teacher, (t) => t.id)
  @JoinColumn({ name: 'recordedBy' })
  recordedBy: Teacher;

  @ManyToOne(() => Teacher, (t) => t.id)
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
