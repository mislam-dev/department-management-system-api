import { logger, LoggingInterceptor } from '@app/common/logger';
import { NestFactory } from '@nestjs/core';
import { DocsServiceModule } from './docs-service.module';
import { setupSwagger } from './swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(DocsServiceModule, {
    logger: logger,
  });
  const port = process.env.PORT ?? 3000;

  app.useGlobalInterceptors(new LoggingInterceptor());
  setupSwagger(app);

  await app.listen(port);
  console.log(`🚀 Docs Service is running on: http://localhost:${port}`);
}
void bootstrap();
