import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { defaultJobOptions, QueueNames } from '@lib/shared/config';
import { EventProcessorService } from './event-processor.service';
import { RewardQueueService } from '../services/reward-queue.service';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: QueueNames.EVENTS,
        defaultJobOptions,
      },
      {
        name: QueueNames.ELIGIBLE_REWARDS,
        defaultJobOptions,
      },
    ),
  ],
  providers: [EventProcessorService, RewardQueueService],
})
export class EventProcessorModule {}
