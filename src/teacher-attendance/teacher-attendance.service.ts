import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/pagination/pagination.types';
import { Repository } from 'typeorm';
import { CreateTeacherAttendanceDto } from './dto/create-teacher-attendance.dto';
import { UpdateTeacherAttendanceDto } from './dto/update-teacher-attendance.dto';
import { TeacherAttendance } from './entities/teacher-attendance.entity';

@Injectable()
export class TeacherAttendanceService {
  constructor(
    @InjectRepository(TeacherAttendance)
    private readonly repo: Repository<TeacherAttendance>,
  ) {}
  create(
    createDto: CreateTeacherAttendanceDto & {
      teacherId: string;
      recordedById: string;
    },
  ) {
    return this.repo.create(createDto);
  }

  async findAll({
    limit,
    offset,
    teacherId,
  }: PaginationOptions & { teacherId: string }) {
    const [results, total] = await this.repo.findAndCount({
      take: limit,
      skip: offset,
      where: {
        teacherId,
      },
    });
    return {
      total,
      limit,
      offset,
      results,
    };
  }

  async findOne(id: string) {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Resource not found!');
    return record;
  }

  async update(id: string, updateDto: UpdateTeacherAttendanceDto) {
    const teacherAttendance = await this.findOne(id);
    Object.assign(teacherAttendance, updateDto);
    return this.repo.update({ id }, teacherAttendance);
  }

  async remove(id: string) {
    const results = await this.repo.delete(id);
    if (!results.affected) throw new NotFoundException('Resource not found!');
  }
}
