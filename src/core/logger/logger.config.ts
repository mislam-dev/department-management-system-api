import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import LokiTransport from 'winston-loki';
export const logger = WinstonModule.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'logs/combined.log',
      level: 'info',
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new LokiTransport({
      host: 'http://loki:3200',
      labels: {
        app: 'dms',
      },
      json: true,
      format: winston.format.json(),
      replaceTimestamp: true,
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context, ms }) => {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
          return `[${timestamp}] ${level}: [${context || 'App'}] ${message} ${ms}`;
        }),
      ),
    }),
  ],
});
