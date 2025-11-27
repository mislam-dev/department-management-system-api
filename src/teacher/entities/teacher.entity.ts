import { CourseSchedule } from 'src/course_schedule/entities/course_schedule.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
}
