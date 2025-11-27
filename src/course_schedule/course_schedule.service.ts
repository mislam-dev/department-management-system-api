import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseService } from 'src/course/course.service';
import { Repository } from 'typeorm';
import { CreateCourseScheduleDto } from './dto/create-course_schedule.dto';
import { UpdateCourseScheduleDto } from './dto/update-course_schedule.dto';
import { CourseSchedule } from './entities/course_schedule.entity';

@Injectable()
export class CourseScheduleService {
  constructor(
    @InjectRepository(CourseSchedule)
    private readonly repo: Repository<CourseSchedule>,
    private readonly courseService: CourseService,
  ) {}
  async create(courseId: string, createDto: CreateCourseScheduleDto) {
    await this.courseService.findOne(courseId);
    const courseSchedule = this.repo.create({ ...createDto, courseId });
    return this.repo.save(courseSchedule);
  }

  findAll(courseId: string) {
    return this.repo.find({ where: { courseId } });
  }

  async findOne(id: string) {
    const course = await this.repo.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Course not found!');
    return course;
  }

  async update(id: string, updateDto: UpdateCourseScheduleDto) {
    const course = await this.findOne(id);
    Object.assign(course, updateDto);
    return this.repo.save(course);
  }

  async remove(id: string) {
    const results = await this.repo.delete({ id });
    if (!results.affected) throw new NotFoundException('Course not found!');
  }
}
