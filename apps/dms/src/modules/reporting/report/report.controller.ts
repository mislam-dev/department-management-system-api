import { CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { SetPermissions } from '../../../core/authentication/auth/decorators/set-permissions.decorator';
import {
  User,
  type UserPayload,
} from '../../../core/authentication/auth/decorators/user.decorator';
import { CreateReportDto } from './dto/create-report.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { ReportService } from './report.service';

@Controller('report')
@CacheTTL(1000 * 60 * 60 * 24 * 30) // 30 days
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @SetPermissions('reports:create')
  @Post()
  create(@Body() createReportDto: CreateReportDto, @User() user: UserPayload) {
    return this.reportService.create({
      ...createReportDto,
      generatedById: user.userId,
    });
  }

  @SetPermissions('reports:get')
  @Get()
  findAll(@Query() query: FindAllQueryDto) {
    return this.reportService.findAll({
      limit: query.limit || 10,
      offset: query.offset || 0,
    });
  }
}
