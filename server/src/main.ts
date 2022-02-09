import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.File({
          filename: 'logs/fo-serapion.log',
          level: 'error',
          maxsize: 104857600,
        }),
      ],
    }),
  });
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  app.enableCors();
  app.setGlobalPrefix('api', {
    exclude: ['auth/google/callback', 'auth/google'],
  });

  await app.listen(port);
}
bootstrap();
