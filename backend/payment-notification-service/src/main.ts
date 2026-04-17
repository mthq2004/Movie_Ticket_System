import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(3004, '0.0.0.0');
  console.log('Payment+Notification Service running on http://0.0.0.0:3004');
}
bootstrap();

