import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
  ) {}

  async create(dto: CreateReportDto) {
    const report = this.reportRepo.create({
      ...dto,
    });

    return this.reportRepo.save(report);
  }

  async findAll(): Promise<Report[]> {
    return this.reportRepo.find({
      relations: ['generatedBy'],
    });
  }
}
