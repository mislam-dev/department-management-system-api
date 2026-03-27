import { INestApplication, Logger } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

export function setupSwagger(app: INestApplication): void {
  const logger = new Logger('Swagger Setup');
  const swaggerFile = path.join(__dirname, 'core/swagger', 'swagger.yaml');
  if (fs.existsSync(swaggerFile)) {
    const files = fs.readFileSync(swaggerFile, 'utf8');
    const document: OpenAPIObject = yaml.load(files) as OpenAPIObject;
    SwaggerModule.setup('docs', app, document);
  } else {
    logger.warn(`Swagger YAML file not found at ${swaggerFile}`);
  }
}
