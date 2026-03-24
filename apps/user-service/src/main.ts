import { logger, LoggingInterceptor } from '@app/common/logger';
import { validationPipe } from '@app/common/pipes/validation.pipe';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { setupSwagger } from './core/swagger/swagger.config';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule, {
    logger: logger,
  });
  const port = process.env.PORT ?? 3000;

  useContainer(app.select(UserServiceModule), {
    fallback: true,
    fallbackOnErrors: true,
  });
  app.useGlobalPipes(validationPipe);
  app.useGlobalInterceptors(new LoggingInterceptor());
  setupSwagger(app);

  await app.listen(port);
  console.log(`🚀 User Service is running on: http://localhost:${port}`);
}
void bootstrap();
