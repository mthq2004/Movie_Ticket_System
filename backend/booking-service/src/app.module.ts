import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsModule } from './bookings/bookings.module';
import { Booking } from './bookings/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '172.28.108.173',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'movie_ticket_db',
      entities: [Booking],
      synchronize: true,
    }),
    BookingsModule,
  ],
})
export class AppModule {}

