import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AiService } from 'src/ai/ai.service';
import { CourseService } from 'src/course/course.service';
import { PaginationOptions } from 'src/student/student.service';
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
    private readonly aiService: AiService,
  ) {}
  async create(courseId: string, createDto: CreateCourseScheduleDto) {
    await this.courseService.findOne(courseId);
    const courseSchedule = this.repo.create({ ...createDto, courseId });
    return this.repo.save(courseSchedule);
  }

  async findAll(courseId: string, paginationOptions: PaginationOptions) {
    // await this.aiService.courseScheduleAssistant({
    //   semesters: {
    //     ids: [
    //       'a1593306-7fd2-453b-a34c-79c165a9380b',
    //       '19db3fcc-da9d-4539-bc77-c7b00d46cd60',
    //     ],
    //     start: '01-01-25',
    //     end: '01-01-26',
    //   },
    // });

    const { limit, offset } = paginationOptions;
    const [results, total] = await this.repo.findAndCount({
      where: { courseId },
      skip: offset,
      take: limit,
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
