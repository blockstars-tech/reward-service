import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueNames, defaultJobOptions } from '@lib/shared/config';
import { SharedModule } from '@lib/shared/modules';
import { DatabaseModule } from '@lib/database';
import { EvmTransactionService } from './transaction-processor.service';
import { NonceManager } from './nonce-manager';

@Module({
  imports: [
    SharedModule,
    DatabaseModule,
    BullModule.registerQueue({
      name: QueueNames.ELIGIBLE_REWARDS,
      defaultJobOptions,
    }),
  ],
  providers: [EvmTransactionService, NonceManager],
})
export class EvmTransactionModule {}
