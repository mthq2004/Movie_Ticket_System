import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [PaymentService, RedisService],
})
export class PaymentModule {}
