import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type PaymentStatus = 'completed' | 'failed';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  bookingId!: number;

  @Column()
  userId!: number;

  @Column()
  username!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @Column()
  status!: PaymentStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
