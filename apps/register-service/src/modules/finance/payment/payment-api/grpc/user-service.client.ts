import {
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient,
} from '@app/grpc/protos/user';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export class GrpcUserServiceClient implements OnModuleInit {
  private logger = new Logger(GrpcUserServiceClient.name);
  private userService: UserServiceClient;

  constructor(@Inject(USER_PACKAGE_NAME) private readonly client: ClientGrpc) {}
  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);

    this.logger.log('Student service client initialized');
  }

  async getUserById(userId: string) {
    const student = await lastValueFrom(
      this.userService.getUserById({ userId }),
    );
    return student;
  }
}
