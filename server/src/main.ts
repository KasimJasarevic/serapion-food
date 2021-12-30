import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  app.enableCors();
  app.setGlobalPrefix('api', {
    exclude: ['auth/google/callback'],
  });

  await app.listen(port);
}
bootstrap();
