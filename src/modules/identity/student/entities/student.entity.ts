import { Semester } from 'src/modules/academic/semester/entities/semester.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED',
  DROPPED = 'DROPPED',
}

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'date' })
  enrolmentDate: string;

  @Column({ type: 'enum', enum: StudentStatus, default: StudentStatus.ACTIVE })
  status?: StudentStatus;

  @Column()
  session: string;

  @Column({ type: 'int', nullable: true })
  graduationYear?: number;

  @Column({ type: 'uuid' })
  currentSemesterId: string;

  @ManyToOne(() => Semester, (semester) => semester.students, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'currentSemesterId' })
  currentSemester: Semester;
}
