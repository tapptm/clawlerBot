import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import {ConfigService} from '@nestjs/config'
import { CustomLogger } from './config/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger('Nest'),
  });
  const configService = new ConfigService()
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('v1');
  await app.listen(configService.get<number>('NODE_PORT'));
}
bootstrap();
