import { Module } from '@nestjs/common';
import { AuthModule } from './authentication/auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { CacheService } from './cache/cache.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
    AuthModule,
    SeederModule,
    ConfigModule,
    DatabaseModule,
    CacheModule,
  ],
  exports: [
    AuthModule,
    SeederModule,
    ConfigModule,
    DatabaseModule,
    CacheModule,
  ],
  providers: [CacheService],
})
export class CoreModule {}
