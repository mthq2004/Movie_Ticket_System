import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Payment } from './payment.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class PaymentService implements OnModuleInit {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    private readonly redisService: RedisService,
  ) {}

  onModuleInit() {
    // Subscribe BOOKING_CREATED → xử lý thanh toán
    this.redisService.subscribe('BOOKING_CREATED', async (data) => {
      console.log('\n[Payment] Received BOOKING_CREATED:', data);
      await this.processPayment(data);
    });

    // Subscribe PAYMENT_COMPLETED → gửi notification
    this.redisService.subscribe('PAYMENT_COMPLETED', (data) => {
      console.log('\n[Notification] ✅ PAYMENT_COMPLETED received');
      console.log(
        `[Notification] 🎉 Booking #${data.bookingId} của ${data.username} thành công! Phim: ${data.movieTitle}`,
      );
    });

    // Subscribe BOOKING_FAILED → log notification
    this.redisService.subscribe('BOOKING_FAILED', (data) => {
      console.log('\n[Notification] ❌ BOOKING_FAILED received');
      console.log(
        `[Notification] 💔 Booking #${data.bookingId} của ${data.username} thất bại! Lý do: Thanh toán không thành công.`,
      );
    });

    console.log('[PaymentService] Listening for BOOKING_CREATED events...');
  }

  private async processPayment(data: any): Promise<void> {
    // Giả lập xử lý: 70% thành công, 30% thất bại
    const isSuccess = Math.random() < 0.7;
    const status: 'completed' | 'failed' = isSuccess ? 'completed' : 'failed';

    console.log(`[Payment] Processing booking #${data.bookingId}... Result: ${status.toUpperCase()}`);

    // Lưu vào DB
    const payment = this.paymentRepo.create({
      bookingId: data.bookingId,
      userId: data.userId,
      username: data.username,
      amount: data.totalPrice,
      status,
    });
    await this.paymentRepo.save(payment);

    // Cập nhật trạng thái booking qua HTTP
    try {
      await axios.patch(`http://localhost:3003/bookings/${data.bookingId}/status`, {
        status: isSuccess ? 'confirmed' : 'failed',
      });
    } catch (err) {
      console.error('[Payment] Could not update booking status:', err.message);
    }

    // Publish event tương ứng
    if (isSuccess) {
      await this.redisService.publish('PAYMENT_COMPLETED', {
        paymentId: payment.id,
        bookingId: data.bookingId,
        userId: data.userId,
        username: data.username,
        movieTitle: data.movieTitle,
        amount: data.totalPrice,
        timestamp: new Date().toISOString(),
      });
      console.log(`[EVENT] PAYMENT_COMPLETED: Booking #${data.bookingId}`);
    } else {
      await this.redisService.publish('BOOKING_FAILED', {
        bookingId: data.bookingId,
        userId: data.userId,
        username: data.username,
        movieTitle: data.movieTitle,
        reason: 'Payment processing failed',
        timestamp: new Date().toISOString(),
      });
      console.log(`[EVENT] BOOKING_FAILED: Booking #${data.bookingId}`);
    }
  }
}
