import { CourseSchedule } from 'src/modules/academic/course_schedule/entities/course_schedule.entity';
import { TeacherUnavailability } from 'src/modules/attendance/teacher_unavailability/entities/teacher_unavailability.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ nullable: true })
  designation?: string;

  @Column({ type: 'date', nullable: true })
  joinDate?: string;

  @Column({ nullable: true })
  officeLocation?: string;

  @OneToMany(() => CourseSchedule, (cs) => cs.teacherId)
  courseSchedule: CourseSchedule[];

  @ManyToOne(() => TeacherUnavailability, (tu) => tu.teacherId)
  unavailability: TeacherUnavailability[];
}
