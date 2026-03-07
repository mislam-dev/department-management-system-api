import { Module } from '@nestjs/common';

import { Auth0JWTStrategy } from '@app/common/auth/strategy';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [],
  providers: [Auth0JWTStrategy],
})
export class AuthServiceModule {}
