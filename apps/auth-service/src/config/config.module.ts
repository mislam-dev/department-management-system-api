import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { auth0_m2m } from './auth0-m2m.config';
import auth0Config from './auth0.config';
import { databaseConfig } from './database.config';
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [auth0Config, databaseConfig, auth0_m2m],
    }),
  ],
})
export class ConfigModule {}
