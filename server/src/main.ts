import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  app.enableCors();
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'auth', method: RequestMethod.GET }],
  });

  await app.listen(port);
}
bootstrap();
