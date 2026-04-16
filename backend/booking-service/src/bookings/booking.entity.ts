import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export type BookingStatus = 'pending' | 'confirmed' | 'failed';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  username!: string;

  @Column()
  movieId!: number;

  @Column()
  movieTitle!: string;

  @Column()
  seats!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice!: number;

  @Column({ default: 'pending' })
  status!: BookingStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
