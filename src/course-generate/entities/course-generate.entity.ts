import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('course-generate')
export class CourseGenerate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  data: string;
}
