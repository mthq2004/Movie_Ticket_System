import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(8082, '0.0.0.0');
  console.log('Movie Service running on http://172.28.108.173:8082');
}
bootstrap();

