import { logger, LoggingInterceptor } from '@app/common/logger';
import { validationPipe } from '@app/common/pipes/validation.pipe';
import { USER_PACKAGE_NAME } from '@app/grpc/protos/user';
import { NestFactory } from '@nestjs/core';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { setupSwagger } from './core/swagger/swagger.config';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule, {
    logger: logger,
  });
  const port = process.env.PORT ?? 3000;
  const grpcPort = process.env.GRPC_PORT ?? 5003;

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: [USER_PACKAGE_NAME],
      protoPath: [join(process.cwd(), 'libs/grpc/src/protos/user.proto')],
      url: `0.0.0.0:${grpcPort}`,
    },
  });

  await app.startAllMicroservices();

  useContainer(app.select(UserServiceModule), {
    fallback: true,
    fallbackOnErrors: true,
  });
  app.useGlobalPipes(validationPipe);
  app.useGlobalInterceptors(new LoggingInterceptor());
  setupSwagger(app);

  await app.listen(port);
  console.log(`🚀 User Service is running on: http://localhost:${port}`);
  console.log(
    `🚀 Grpc User Service is running on: http://localhost:${grpcPort}`,
  );
}
void bootstrap();
