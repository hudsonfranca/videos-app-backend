import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

async function bootstrap() {
 const base = process.env.PWD;
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({ credentials: true, origin: true});

  app.use('/uploads', express.static(base + '/uploads'));

  await app.listen(process.env.PORT);
}
bootstrap();
