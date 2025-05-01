import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionsFilter } from './utils/global.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api/v1');
  app.enableCors();
  
  const config = new DocumentBuilder()
    .setTitle('Course API')
    .setDescription('API for managing courses')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(5000);


}

bootstrap();
