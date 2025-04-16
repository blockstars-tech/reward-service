import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { redisConfigOptions } from '../config';

@Module({
  imports: [
    BullModule.forRoot({
      connection: redisConfigOptions,
    }),
  ],
  exports: [BullModule],
})
export class BullMqModule {}
