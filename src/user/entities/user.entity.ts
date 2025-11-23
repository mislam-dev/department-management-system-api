import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export const Designation = {
  DEPARTMENT_HEAD: 'department_head',
  CHIEF_INSTRUCTOR: 'chief_instructor',
  INSTRUCTOR: 'instructor',
  JUNIOR_INSTRUCTOR: 'junior_instructor',
  CRAFT_INSTRUCTOR: 'craft_instructor',
  CR: 'cr',
  COMPUTER_OPERATOR: 'computer_operator',
  OFFICE_ASSISTANT: 'office_assistant',
  STUDENT: 'student',
} as const;

export type DesignationType = (typeof Designation)[keyof typeof Designation];

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true, default: null })
  @IsString()
  username: string;

  @Column({ unique: true })
  auth0_user_id: string;

  @Column()
  @IsString()
  fullName: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  auth0_role: string;

  @Column({ type: 'enum', enum: Object.values(Designation) })
  @IsEnum(Designation)
  designation: DesignationType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
