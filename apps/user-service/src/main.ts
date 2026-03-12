import { logger, LoggingInterceptor } from '@app/common/logger';
import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './core/swagger/swagger.config';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule, {
    logger: logger,
  });
  const port = process.env.PORT ?? 3000;

  app.useGlobalInterceptors(new LoggingInterceptor());
  setupSwagger(app);

  await app.listen(port);
  console.log(`🚀 User Service is running on: http://localhost:${port}`);
}
void bootstrap();
