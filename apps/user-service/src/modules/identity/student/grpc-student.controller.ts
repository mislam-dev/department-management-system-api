import { ExceptionFilter } from '@app/grpc/filters/exception.filter';
import {
  StudentIdRequest,
  StudentResponse,
  StudentServiceController,
  StudentServiceControllerMethods,
} from '@app/grpc/protos/student';
import { status } from '@grpc/grpc-js';
import {
  Controller,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { StudentService } from './student.service';

@UseFilters(ExceptionFilter)
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => {
      const formattedError = errors.map((err) => {
        return {
          field: err.property,
          values: Object.values(err.constraints || {}),
        };
      });
      return new RpcException({
        code: status.INVALID_ARGUMENT,
        message: formattedError,
      });
    },
  }),
)
@Controller()
@StudentServiceControllerMethods()
export class GrpcStudentController implements StudentServiceController {
  constructor(private readonly studentService: StudentService) {}
  async getStudentById({
    studentId,
  }: StudentIdRequest): Promise<StudentResponse> {
    return await this.studentService.findOne(studentId);
  }
}
