import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { auth0_m2m } from './auth0-m2m.config';
import auth0Config from './auth0.config';
import { bullRedisConfig } from './bull-redis.config';
import { databaseConfig } from './database.config';
import { paymentFrontendConfig } from './payment-frontend.config';
import { sslConfig } from './sslcomerz.config';
import { stripeConfig } from './strIpe.config';
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        auth0Config,
        databaseConfig,
        auth0_m2m,
        paymentFrontendConfig,
        stripeConfig,
        sslConfig,
        bullRedisConfig,
      ],
    }),
  ],
})
export class ConfigModule {}
