import { ExceptionFilter } from '@app/grpc/filters/exception.filter';
import {
  CourseScheduleIdRequest,
  CourseScheduleResponse,
  CourseScheduleServiceController,
  CourseScheduleServiceControllerMethods,
} from '@app/grpc/protos/course/course-schedule';
import { status } from '@grpc/grpc-js';
import {
  Controller,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CourseScheduleService } from './course_schedule.service';

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
@CourseScheduleServiceControllerMethods()
export class GrpcCourseScheduleController
  implements CourseScheduleServiceController
{
  constructor(private readonly courseScheduleService: CourseScheduleService) {}
  async getCourseScheduleById({
    id,
  }: CourseScheduleIdRequest): Promise<CourseScheduleResponse> {
    return await this.courseScheduleService.findOne(id);
  }
}
