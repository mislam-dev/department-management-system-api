import { logger, LoggingInterceptor } from '@app/common/logger';
import { validationPipe } from '@app/common/pipes/validation.pipe';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { AuthServiceModule } from './auth-service.module';
import { setupSwagger } from './swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule, {
    logger: logger,
  });

  const grpcPort = process.env.GRPC_PORT || 5000;

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'auth0',
      url: `0.0.0.0:${grpcPort}`,
      protoPath: join(process.cwd(), 'libs/grpc/src/auth/auth0.proto'),
    },
  });

  await app.startAllMicroservices();

  app.useGlobalPipes(validationPipe);
  useContainer(app.select(AuthServiceModule), { fallbackOnErrors: true });

  app.useGlobalInterceptors(new LoggingInterceptor());
  setupSwagger(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Auth Service is running on: http://localhost:${port}`);
  console.log(
    `🚀 GRPC Auth Service is running on: http://localhost:${grpcPort}`,
  );
}
void bootstrap();
