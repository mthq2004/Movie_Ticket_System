import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column()
  genre!: string;

  @Column()
  duration!: number; // phút

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ default: 100 })
  availableSeats!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
