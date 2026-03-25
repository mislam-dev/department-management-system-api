import { Injectable } from '@nestjs/common';

@Injectable()
export class AcademicServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
