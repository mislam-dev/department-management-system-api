import { logger, LoggingInterceptor } from '@app/common/logger';
import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { setupSwagger } from './swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule, {
    logger: logger,
  });
  const port = process.env.PORT ?? 3000;

  app.useGlobalInterceptors(new LoggingInterceptor());
  setupSwagger(app);

  await app.listen(port);
  console.log(`🚀 Auth Service is running on: http://localhost:${port}`);
}
void bootstrap();
