import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private publisher: Redis;
  private subscriber: Redis;

  constructor() {
    this.publisher = new Redis({ host: 'localhost', port: 6379 });
    this.subscriber = new Redis({ host: 'localhost', port: 6379 });
  }

  async publish(channel: string, message: object): Promise<void> {
    await this.publisher.publish(channel, JSON.stringify(message));
    console.log(`[Redis] Published to ${channel}:`, message);
  }

  subscribe(channel: string, callback: (message: any) => void): void {
    this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, msg) => {
      if (ch === channel) {
        callback(JSON.parse(msg));
      }
    });
  }

  onModuleDestroy() {
    this.publisher.disconnect();
    this.subscriber.disconnect();
  }
}
