import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RoomType {
  OFFICE = 'office',
  CLASSROOM = 'classroom',
  LAB = 'lab',
  WASHROOM = 'washroom',
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: RoomType,
    default: RoomType.CLASSROOM,
  })
  type: RoomType;

  @Column('int', { default: 30 })
  capacity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
