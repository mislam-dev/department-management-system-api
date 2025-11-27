import { Teacher } from 'src/teacher/entities/teacher.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('course_schedules')
@Unique('UQ_course_schedule_composite', [
  'courseId',
  'dayOfWeek',
  'startTime',
  'endTime',
  'room',
  'teacherId',
])
export class CourseSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  courseId: string;

  @Column({ type: 'varchar', length: 20 })
  dayOfWeek: string; // Example: MONDAY, TUESDAY, etc.

  @Column({ type: 'time' })
  startTime: string; // HH:MM:SS

  @Column({ type: 'time' })
  endTime: string; // HH:MM:SS

  @Column({ type: 'varchar', length: 100, nullable: true })
  room?: string;

  @Column({ type: 'uuid', nullable: true })
  teacherId?: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;
}
