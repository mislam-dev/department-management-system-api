import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheService } from '../cache/cache.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    CacheModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          stores: [
            new KeyvRedis(
              `redis://${config.getOrThrow<string>('cache_redis.host')}:${config.getOrThrow<number>('cache_redis.port')}`,
            ),
          ],
          isGlobal: true,
          ttl: 60 * 60 * 24 * 1, // 1 day
          max: 1000, // 1000 items
          namespace: config.get<string>('cache_redis.namespace') || 'dms_api',
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheModule, CacheService],
})
export class DatabaseModule {}
