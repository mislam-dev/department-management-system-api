import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Teacher } from '../../../identity/teacher/entities/teacher.entity';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
  HALF_DAY = 'HALF_DAY',
  ON_LEAVE = 'ON_LEAVE',
}

@Entity('attendance')
@Unique('UQ_student_date_schedule_checking', [
  'studentId',
  'date',
  'courseScheduleId',
  'checkInTime',
])
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  studentId: string;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus; // e.g. PRESENT, ABSENT, LATE

  @Column({ type: 'time', nullable: true })
  checkInTime?: string; // HH:MM:SS

  @Column({ type: 'time', nullable: true })
  checkOutTime?: string; // HH:MM:SS

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'uuid', nullable: true })
  courseScheduleId?: string;

  @Column({ type: 'uuid', nullable: true })
  recordedBy?: string;

  @ManyToOne(() => Teacher, (t) => t.id)
  @JoinColumn({ name: 'recordedBy' })
  recordBy: Teacher;
}
