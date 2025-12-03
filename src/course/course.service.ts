import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/pagination/pagination.types';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private readonly repo: Repository<Course>,
  ) {}
  create(createCourseDto: CreateCourseDto) {
    const course = this.repo.create(createCourseDto);
    return this.repo.save(course);
  }

  async findAll({ limit, offset }: PaginationOptions) {
    const [results, total] = await this.repo.findAndCount({
      take: limit,
      skip: offset,
    });

    return {
      total,
      limit,
      offset,
      results,
    };
  }

  async findOne(id: string) {
    const course = await this.repo.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Course not found!');
    return course;
  }
  async findOneBy(options: FindOneOptions<Course>) {
    const course = await this.repo.findOne(options);
    if (!course) throw new NotFoundException('Course not found!');
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(id);
    Object.assign(course, updateCourseDto);
    return this.repo.save(course);
  }

  async remove(id: string) {
    const results = await this.repo.delete({ id });
    if (!results.affected) throw new NotFoundException('Course not found!');
  }
}
