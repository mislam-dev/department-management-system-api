import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Semester {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
