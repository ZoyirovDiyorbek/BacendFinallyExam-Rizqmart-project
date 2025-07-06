import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  app.enableCors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:4000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200,
  });

  const config = new DocumentBuilder()
    .setTitle('Tijara platform API backEnd')
    .setDescription('Platform for publish a announcement backend API')
    .setVersion('1.0')
    .addTag('Tijara')
    .addCookieAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  if (process.env.NODE_ENV?.trim() == 'development') {
    SwaggerModule.setup('docs', app, documentFactory);
    app.use(morgan('dev'))
  }
  const PORT = process.env.APP_PORT || 2006;
  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`http://localhost:${PORT}/docs`);
    console.log(process.env.CORS_ORIGIN);
    console.log(process.env.NODE_ENV);
  });
}
bootstrap();
