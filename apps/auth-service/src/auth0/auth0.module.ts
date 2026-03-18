import { Module } from '@nestjs/common';
import { Auth0GrpcController } from './auth0-grpc.controller';
import { Auth0Service } from './auth0.service';

@Module({
  providers: [Auth0Service],
  controllers: [Auth0GrpcController],
  exports: [Auth0Service],
})
export class Auth0Module {}
