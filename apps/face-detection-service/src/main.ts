import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { Server } from 'node:http';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT ?? 3000;

  // Start the application
  await app.listen(port);
  console.log(`Application is running on: ${port}`);

  // Workaround for `nest --watch` EADDRINUSE race conditions in Docker:
  // aggressively force-close the server connections so the port unbinds instantly
  // before the new watch process attempts to bind.
  const rawServer = app.getHttpServer() as Server;
  ['SIGINT', 'SIGTERM', 'SIGUSR2'].forEach((signal) => {
    process.on(signal as NodeJS.Signals, () => {
      console.log(
        `Received ${signal}, forcefully closing server to release port ${port}...`,
      );
      if ('closeAllConnections' in rawServer) {
        rawServer.closeAllConnections(); // Node 18.2.0+
      }
      rawServer.close(() => process.exit(0));
      setTimeout(() => process.exit(0), 1000); // safety fallback
    });
  });
}
void bootstrap();
