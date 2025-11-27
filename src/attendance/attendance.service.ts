import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly repo: Repository<Attendance>,
  ) {}
  async create(createDto: CreateAttendanceDto) {
    const courseSchedule = this.repo.create({ ...createDto });
    return this.repo.save(courseSchedule);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const attendance = await this.repo.findOne({ where: { id } });
    if (!attendance)
      throw new NotFoundException('Attendance record not found!');
    return attendance;
  }

  async update(id: string, updateDto: UpdateAttendanceDto) {
    const attendance = await this.findOne(id);
    Object.assign(attendance, updateDto);
    return this.repo.save(attendance);
  }

  async remove(id: string) {
    const results = await this.repo.delete({ id });
    if (!results.affected)
      throw new NotFoundException('Attendance record not found!');
  }
}
