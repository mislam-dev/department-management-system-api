import {
  USER_PACKAGE_NAME,
  USER_SERVICE_NAME,
  UserServiceClient as UserServiceClientType,
} from '@app/grpc/protos/user';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserServiceClient implements OnModuleInit {
  private readonly logger = new Logger(UserServiceClient.name);
  private userService: UserServiceClientType;
  constructor(@Inject(USER_PACKAGE_NAME) private readonly client: ClientGrpc) {}
  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClientType>(USER_SERVICE_NAME);
    this.logger.log('User service client initialized');
  }

  async getUserById(userId: string) {
    const user = await lastValueFrom(this.userService.getUserById({ userId }));
    return user;
  }
}
