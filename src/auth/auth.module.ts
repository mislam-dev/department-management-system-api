import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Auth0Service } from 'src/auth0/auth0.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth0JWTStrategy } from './strategy/auth0-jwt.strategy';

@Module({
  providers: [AuthService, Auth0JWTStrategy, Auth0Service],
  imports: [PassportModule, UserModule],
  controllers: [AuthController],
})
export class AuthModule {}
