import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  await app.listen(3003, '0.0.0.0');
  console.log('Booking Service running on http://0.0.0.0:3003');
}
bootstrap();

