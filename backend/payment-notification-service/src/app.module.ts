import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from './payment/payment.module';
import { Payment } from './payment/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '172.28.108.173',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'movie_ticket_db',
      entities: [Payment],
      synchronize: true,
    }),
    PaymentModule,
  ],
})
export class AppModule {}

