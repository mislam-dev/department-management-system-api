import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TeacherUnavailability } from '../../../attendance/teacher_unavailability/entities/teacher_unavailability.entity';

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

  @ManyToOne(() => TeacherUnavailability, (tu) => tu.teacherId)
  unavailability: TeacherUnavailability[];
}
