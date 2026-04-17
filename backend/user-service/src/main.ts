import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(8081, '0.0.0.0');
  console.log('User Service running on http://172.28.108.173:8081');
}
bootstrap();

