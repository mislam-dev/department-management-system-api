import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { Semester } from './entities/semester.entity';

@Injectable()
export class SemesterService {
  constructor(
    @InjectRepository(Semester) private readonly repo: Repository<Semester>,
  ) {}
  create(createSemesterDto: CreateSemesterDto) {
    const semester = this.repo.create(createSemesterDto);
    return this.repo.save(semester);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const semester = await this.repo.findOne({ where: { id } });
    if (!semester) throw new NotFoundException('Semester not found!');
    return semester;
  }

  async update(id: string, updateSemesterDto: UpdateSemesterDto) {
    const semester = await this.findOne(id);
    Object.assign(semester, updateSemesterDto);
    return this.repo.save(semester);
  }

  async remove(id: string) {
    const results = await this.repo.delete(id);
    if (!results.affected) throw new NotFoundException('Semester not found!');
  }
}
