import { Auth0JWTStrategy } from '@app/common/auth/strategy';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { Auth0Module } from './auth0/auth0.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, Auth0Module, AuthModule],
  controllers: [],
  providers: [Auth0JWTStrategy],
})
export class AuthServiceModule {}
