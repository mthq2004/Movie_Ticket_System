import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    private readonly redisService: RedisService,
  ) {}

  async findAll(): Promise<Booking[]> {
    return this.bookingRepo.find({ order: { createdAt: 'DESC' } });
  }

  async create(dto: CreateBookingDto): Promise<Booking> {
    const booking = this.bookingRepo.create({ ...dto, status: 'pending' });
    const saved = await this.bookingRepo.save(booking);

    // Publish BOOKING_CREATED event
    await this.redisService.publish('BOOKING_CREATED', {
      bookingId: saved.id,
      userId: saved.userId,
      username: saved.username,
      movieId: saved.movieId,
      movieTitle: saved.movieTitle,
      seats: saved.seats,
      totalPrice: saved.totalPrice,
      timestamp: new Date().toISOString(),
    });
    console.log(`[EVENT] BOOKING_CREATED: Booking #${saved.id} by ${saved.username}`);

    return saved;
  }

  async updateStatus(bookingId: number, status: 'confirmed' | 'failed'): Promise<void> {
    await this.bookingRepo.update(bookingId, { status });
    console.log(`[Booking] Booking #${bookingId} status updated to ${status}`);
  }
}
