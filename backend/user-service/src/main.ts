import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(3001, '0.0.0.0');
  console.log('User Service running on http://0.0.0.0:3001');
}
bootstrap();

