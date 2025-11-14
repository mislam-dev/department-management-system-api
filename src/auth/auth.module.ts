import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Auth0JWTStrategy } from './strategy/auth0-jwt.strategy';

@Module({
  providers: [AuthService, Auth0JWTStrategy],
  imports: [PassportModule],
})
export class AuthModule {}
