import {
  AUTH0_PACKAGE_NAME,
  AUTH0_SERVICE_NAME,
  Auth0ServiceClient,
} from '@app/grpc/protos/auth0';
import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

export class GrpcAuth0ServiceClient implements OnModuleInit {
  private logger = new Logger(GrpcAuth0ServiceClient.name);
  private auth0Service: Auth0ServiceClient;

  constructor(
    @Inject(AUTH0_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.auth0Service =
      this.client.getService<Auth0ServiceClient>(AUTH0_SERVICE_NAME);
    this.logger.log('Auth0 service client initialized');
  }

  async getAuth0UserById(auth0Id: string) {
    const user = await lastValueFrom(
      this.auth0Service.getUserById({ userId: auth0Id }),
    );
    return user;
  }
}
