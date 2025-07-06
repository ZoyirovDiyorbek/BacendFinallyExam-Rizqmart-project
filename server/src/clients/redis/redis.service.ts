import { Global, Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
@Global()
export class RedisService implements OnModuleDestroy {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setVlue(key: string, value: string, EX: number) {
    await this.redis.setex(key, EX, value);

    return 'Ok';
  }

  async getvalue(key: string) {
    return await this.redis.get(key);
  }

  async onModuleDestroy() {
    this.redis.disconnect();
  }
}
