import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { setupSwagger } from './swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  const port = process.env.PORT ?? 3000;
  setupSwagger(app);

  await app.listen(port);
  console.log(`🚀 Auth Service is running on: http://localhost:${port}`);
}
void bootstrap();
