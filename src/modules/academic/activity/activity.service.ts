import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/modules/identity/student/student.service';
import { Repository } from 'typeorm';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepo: Repository<Activity>,
  ) {}

  async create(dto: CreateActivityDto) {
    const activity = this.activityRepo.create(dto);
    return this.activityRepo.save(activity);
  }

  async findAll({ limit, offset }: PaginationOptions) {
    const [results, total] = await this.activityRepo.findAndCount({
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

  async findOne(id: string) {
    const activity = await this.activityRepo.findOne({ where: { id } });
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }
    return activity;
  }

  async update(id: string, dto: UpdateActivityDto) {
    const activity = await this.findOne(id);
    Object.assign(activity, dto);
    return this.activityRepo.save(activity);
  }

  async remove(id: string): Promise<void> {
    const activity = await this.findOne(id);
    await this.activityRepo.remove(activity);
  }
}
