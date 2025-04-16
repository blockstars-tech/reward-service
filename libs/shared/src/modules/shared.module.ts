import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { redisConfigOptions } from '../config';
import { loggerOptions } from '../config/logger';
import { BullMqModule } from './bullmq.module';

@Module({
  imports: [
    LoggerModule.forRoot(loggerOptions),
    RedisModule.forRoot({
      config: redisConfigOptions,
    }),
    BullMqModule,
  ],
  exports: [RedisModule],
})
export class SharedModule {}
