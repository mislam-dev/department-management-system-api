import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { aiConfig } from './ai.config';
import { bullRedisConfig } from './bull-redis.config';
import { cacheRedisConfig } from './cache.config';
import { databaseConfig } from './database.config';
import { paymentFrontendConfig } from './payment-frontend.config';
import { sslConfig } from './sslcomerz.config';
import { stripeConfig } from './strIpe.config';
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        aiConfig,
        bullRedisConfig,
        cacheRedisConfig,
        paymentFrontendConfig,
        sslConfig,
        stripeConfig,
      ],
    }),
  ],
})
export class ConfigModule {}
