import { ExceptionFilter } from '@app/grpc/filters/exception.filter';
import {
  UserIdRequest,
  UserResponse,
  UserServiceController,
  UserServiceControllerMethods,
} from '@app/grpc/protos/user';
import { status } from '@grpc/grpc-js';
import {
  Controller,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UserService } from './user.service';

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
@UserServiceControllerMethods()
export class GrpcUserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}
  async getUserById({ userId }: UserIdRequest): Promise<UserResponse> {
    const user = await this.userService.findOne(userId);
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      auth0UserId: user.auth0_user_id,
      auth0Role: user.auth0_role,
      designation: user.designation,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
