import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { COURSE_SCHEDULE_QUEUE } from './course-schedule.constants';
import { CourseGenerateDto } from './dto/create-course-generate.dto';
import {
  CourseGenerate,
  CourseGenerateStatus,
} from './entities/course-generate.entity';

@Injectable()
export class CourseGenerateService {
  constructor(
    @InjectRepository(CourseGenerate)
    private readonly repo: Repository<CourseGenerate>,
    @InjectQueue(COURSE_SCHEDULE_QUEUE)
    private readonly courseGenerateQueue: Queue,
  ) {}
  async generate(dto: CourseGenerateDto) {
    const save = this.repo.create({ data: '' });
    await this.repo.save(save);
    await this.courseGenerateQueue.add(
      'course-generate',
      { ...dto, id: save.id },
      { attempts: 2 },
    );
    return save;
  }

  async findOneById(id: string) {
    const data = await this.repo.findOneBy({ id });
    if (!data) {
      throw new NotFoundException('Resource not found!');
    }
    return data;
  }

  async saveData(data: string, id: string) {
    const save = await this.findOneById(id);
    Object.assign(save, {
      data,
      status: CourseGenerateStatus.COMPLETED,
    });
    const savedData = await this.repo.save(save);
    console.log('course generate data updated');
    return savedData;
  }

  async updateStatus(status: CourseGenerateStatus, id: string) {
    const save = await this.findOneById(id);
    Object.assign(save, {
      status,
    });
    const savedData = await this.repo.save(save);
    console.log('course generate status updated');
    return savedData;
  }

  findAll() {
    return this.repo.find();
  }
}
