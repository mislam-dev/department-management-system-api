import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { User, type UserPayload } from 'src/auth/decorators/user.decorator';
import { CreateReportDto } from './dto/create-report.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  create(@Body() createReportDto: CreateReportDto, @User() user: UserPayload) {
    return this.reportService.create({
      ...createReportDto,
      generatedById: user.userId,
    });
  }

  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    return this.reportService.findAll({
      limit: query.limit || 10,
      offset: query.offset || 0,
    });
  }
}
