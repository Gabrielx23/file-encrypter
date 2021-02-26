import { NestFactory } from '@nestjs/core';
import { App } from './app';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvKeyEnum } from './enum/env-key.enum';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(App);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle(configService.get(EnvKeyEnum.SwaggerTitle))
    .setDescription(configService.get(EnvKeyEnum.SwaggerDescription))
    .setVersion(configService.get(EnvKeyEnum.SwaggerVersion))
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(configService.get(EnvKeyEnum.SwaggerUri), app, document);

  await app.listen(3000);
}

bootstrap();
