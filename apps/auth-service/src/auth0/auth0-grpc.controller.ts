import type {
  Auth0CreateUserDto,
  Auth0CreateUserResponse,
  Auth0UpdateUserDto,
  Empty,
  UserIdRequest,
} from '@app/grpc/auth/auth0';
import { status } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { Auth0Service } from './auth0.service';

@Controller()
export class Auth0GrpcController {
  constructor(private readonly auth0Service: Auth0Service) {}

  @GrpcMethod('AuthService', 'CreateUser')
  async createUser(data: Auth0CreateUserDto): Promise<Auth0CreateUserResponse> {
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

  @GrpcMethod('AuthService', 'UpdateUser')
  async updateUser(data: Auth0UpdateUserDto): Promise<Empty> {
    const { auth0UserId, ...rest } = data;
    await this.auth0Service.updateUser(auth0UserId, rest);
    return {};
  }

  @GrpcMethod('AuthService', 'DeleteUser')
  async deleteUser(data: UserIdRequest): Promise<Empty> {
    const { userId } = data;
    await this.auth0Service.deleteUser(userId);
    return {};
  }
}
