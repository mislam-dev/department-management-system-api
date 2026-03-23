import {
  Auth0CreateUserResponse,
  Auth0ServiceController,
  Auth0ServiceControllerMethods,
  Auth0UpdateUserDto,
  Empty,
  UserIdRequest,
} from '@app/grpc/auth/auth0';
import { ExceptionFilter } from '@app/grpc/filters/exception.filter';
import { status } from '@grpc/grpc-js';
import {
  Controller,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Auth0Service } from './auth0.service';
import { Auth0Interceptor } from './auth0/auth0.interceptor';
import { CreateUserDto } from './dtos/auth0-create-user.dto';

@UseInterceptors(Auth0Interceptor)
@Controller()
@UseFilters(ExceptionFilter)
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => {
      console.log('test');
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
@Auth0ServiceControllerMethods()
export class Auth0GrpcController implements Auth0ServiceController {
  constructor(private readonly auth0Service: Auth0Service) {}

  async createUser(data: CreateUserDto): Promise<Auth0CreateUserResponse> {
    const user = await this.auth0Service.createUser(data);
    if (!user.user_id) {
      throw new RpcException({
        code: status.ABORTED,
        message: 'User creation failed',
      });
    }
    return {
      userId: user.user_id,
    };
  }

  async updateUser(data: Auth0UpdateUserDto): Promise<Empty> {
    const { auth0UserId, ...rest } = data;
    await this.auth0Service.updateUser(auth0UserId, rest);
    return {};
  }

  async deleteUser(data: UserIdRequest): Promise<Empty> {
    const { userId } = data;
    await this.auth0Service.deleteUser(userId);
    return {};
  }
}
