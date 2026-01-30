import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/modules/identity/student/student.service';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateTeacherUnavailabilityDto } from './dto/create-teacher_unavailability.dto';
import { UpdateTeacherUnavailabilityDto } from './dto/update-teacher_unavailability.dto';
import { TeacherUnavailability } from './entities/teacher_unavailability.entity';

@Injectable()
export class TeacherUnavailabilityService {
  constructor(
    @InjectRepository(TeacherUnavailability)
    private readonly repo: Repository<TeacherUnavailability>,
  ) {}
  create(createDto: CreateTeacherUnavailabilityDto & { teacherId: string }) {
    const data = this.repo.create(createDto);
    return this.repo.save(data);
  }

  async findAll({
    limit,
    offset,
    teacherId,
  }: PaginationOptions & { teacherId: string }) {
    const [results, total] = await this.repo.findAndCount({
      where: { teacherId },
      take: limit,
      skip: offset,
      order: { createdAt: 'desc' },
    });

    return {
      total,
      limit,
      offset,
      results,
    };
  }

  find(options?: FindManyOptions<TeacherUnavailability>) {
    return this.repo.find(options);
  }

  async findOne(id: string) {
    const data = await this.repo.findOne({ where: { id } });
    if (!data) throw new NotFoundException('Data not found!');
    return data;
  }

  async update(id: string, updateDto: UpdateTeacherUnavailabilityDto) {
    const find = await this.findOne(id);
    Object.assign(find, updateDto);
    return this.repo.update(id, find);
  }

  async remove(id: string) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException('data not found');
  }
}
