import { AUTH0_SERVICE_NAME, Auth0ServiceClient } from '@app/grpc/protos/auth0';
import { Inject, Logger } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PACKAGE_NAME } from './constants';

type CreateUserType = {
  name: string;
  email: string;
  password: string;
};
type UpdateUserType = {
  auth0UserId: string;
  name: string;
  email: string;
};

export class GrpcAuth0ServiceClient {
  private logger = new Logger(GrpcAuth0ServiceClient.name);
  private auth0Service: Auth0ServiceClient;

  constructor(@Inject(PACKAGE_NAME) private readonly client: ClientGrpc) {}
  onModuleInit() {
    this.auth0Service =
      this.client.getService<Auth0ServiceClient>(AUTH0_SERVICE_NAME);
    this.logger.log('Auth0 service client initialized');
  }

  async createUser(userInfo: CreateUserType) {
    const auth0User = await lastValueFrom(
      this.auth0Service.createUser(userInfo),
    );

    return auth0User;
  }

  async update(updateUser: UpdateUserType): Promise<void> {
    await lastValueFrom(this.auth0Service.updateUser(updateUser));
  }

  async remove(auth0_user_id: string): Promise<void> {
    await lastValueFrom(
      this.auth0Service.deleteUser({ userId: auth0_user_id }),
    );
  }
}
