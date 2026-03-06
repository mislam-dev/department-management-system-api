import { registerAs } from '@nestjs/config';

export const bullRedisConfig = registerAs('bull', () => ({
  host: process.env.BULL_REDIS_HOST,
  port: process.env.BULL_REDIS_PORT,
}));
