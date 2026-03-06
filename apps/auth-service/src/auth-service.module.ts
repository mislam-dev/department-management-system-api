import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
