import { logger, LoggingInterceptor } from '@app/common/logger';
import { SEMESTER_PACKAGE_NAME } from '@app/grpc/protos/semester';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AcademicServiceModule } from './academic-service.module';
import { setupSwagger } from './core/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AcademicServiceModule, {
    logger: logger,
  });
  const port = process.env.PORT ?? 3000;

  const grpcPort = process.env.GRPC_PORT || 5001;

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: SEMESTER_PACKAGE_NAME,
      url: `0.0.0.0:${grpcPort}`,
      protoPath: [
        join(process.cwd(), 'libs/grpc/src/protos/semester.proto'),
        // join(process.cwd(), 'libs/grpc/src/protos/academic.proto'),
      ],
    },
  });

  app.useGlobalInterceptors(new LoggingInterceptor());
  setupSwagger(app);

  await app.startAllMicroservices();
  await app.listen(port);
  console.log(`🚀 Academic Service is running on: http://localhost:${port}`);
  console.log(
    `🚀 GRPC Academic Service is running on: http://localhost:${grpcPort}`,
  );
}
void bootstrap();
