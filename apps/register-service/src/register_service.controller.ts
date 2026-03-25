import { Controller, Get } from '@nestjs/common';
import { RegisterServiceService } from './register_service.service';

@Controller()
export class RegisterServiceController {
  constructor(
    private readonly registerServiceService: RegisterServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.registerServiceService.getHello();
  }
}
