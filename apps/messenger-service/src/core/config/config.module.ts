import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { bullRedisConfig } from './bull-redis.config';
import { cacheRedisConfig } from './cache.config';
import { databaseConfig } from './database.config';
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, bullRedisConfig, cacheRedisConfig],
    }),
  ],
})
export class ConfigModule {}
