import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Auth0Service } from '../auth0/auth0.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, Auth0Service],
  imports: [PassportModule],
  controllers: [AuthController],
})
export class AuthModule {}
