import { registerAs } from '@nestjs/config';

export const cacheRedisConfig = registerAs('cache_redis', () => ({
  host: process.env.CACHE_REDIS_HOST,
  port: process.env.CACHE_REDIS_PORT,
  namespace: process.env.CACHE_REDIS_NAMESPACE,
}));
