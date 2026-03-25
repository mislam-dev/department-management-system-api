import { ExceptionFilter } from '@app/grpc/filters/exception.filter';
import {
  SemesterIdRequest,
  SemesterResponse,
  SemesterServiceController,
  SemesterServiceControllerMethods,
} from '@app/grpc/protos/semester';
import { status } from '@grpc/grpc-js';
import {
  Controller,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { SemesterService } from './semester.service';

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
@SemesterServiceControllerMethods()
export class GrpcSemesterController implements SemesterServiceController {
  constructor(private readonly semesterService: SemesterService) {}
  async getSemesterById(request: SemesterIdRequest): Promise<SemesterResponse> {
    const semester = await this.semesterService.findOne(request.id);
    return {
      id: semester.id,
      name: semester.name,
    };
  }
}
