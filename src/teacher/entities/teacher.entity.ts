import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
