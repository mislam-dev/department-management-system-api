import { Injectable } from '@nestjs/common';

@Injectable()
export class RegisterServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
