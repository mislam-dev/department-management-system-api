import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Notice } from './entities/notice.entity';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepo: Repository<Notice>,
  ) {}

  async create(dto: CreateNoticeDto) {
    const notice = this.noticeRepo.create(dto);
    return this.noticeRepo.save(notice);
  }

  async findAll(): Promise<Notice[]> {
    return this.noticeRepo.find();
  }

  async findOne(id: string) {
    const notice = await this.noticeRepo.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException(`Notice with ID ${id} not found`);
    }
    return notice;
  }

  async update(id: string, dto: UpdateNoticeDto) {
    const notice = await this.findOne(id);
    Object.assign(notice, dto);
    return this.noticeRepo.save(notice);
  }

  async remove(id: string): Promise<void> {
    const notice = await this.findOne(id);
    await this.noticeRepo.remove(notice);
  }
}
