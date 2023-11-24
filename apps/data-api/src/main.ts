/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { ApiResponseInterceptor } from '@hour-master/backend/dto';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const corsOptions = {};
  app.enableCors(corsOptions);

  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Data-API is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
