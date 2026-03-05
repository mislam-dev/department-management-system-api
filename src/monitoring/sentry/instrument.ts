import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    Sentry.consoleLoggingIntegration({
      levels: ['error', 'warn'],
    }),
  ],
  enableLogs: true,
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
});
