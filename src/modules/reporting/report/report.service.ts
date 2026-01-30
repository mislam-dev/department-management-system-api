import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationOptions } from 'src/modules/identity/student/student.service';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
  ) {}

  async create(dto: CreateReportDto & { generatedById: string }) {
    const report = this.reportRepo.create({
      ...dto,
    });

    return this.reportRepo.save(report);
  }

  async findAll({ limit, offset }: PaginationOptions) {
    const [results, total] = await this.reportRepo.findAndCount({
      skip: offset,
      take: limit,
      order: { generatedAt: 'desc' },
    });

    return {
      total,
      limit,
      offset,
      results,
    };
  }
}
