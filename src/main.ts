// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';

import * as dotenv from 'dotenv';

dotenv.config();

// Define the bootstrap function
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Recipes API') // Set the title of the API
    .setDescription('Recipes API description') // Set the description of the API
    .setVersion('0.1') // Set the version of the API
    .build(); // Build the document

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  logger.log(`Application is running on PORT: ${process.env.PORT || 3000}`);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
