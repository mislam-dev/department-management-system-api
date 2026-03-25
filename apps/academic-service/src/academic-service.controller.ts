import { Controller, Get } from '@nestjs/common';
import { AcademicServiceService } from './academic-service.service';

@Controller()
export class AcademicServiceController {
  constructor(
    private readonly academicServiceService: AcademicServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.academicServiceService.getHello();
  }
}
