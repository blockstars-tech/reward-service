import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { defaultJobOptions, QueueNames } from '@lib/shared/config';
import { SchedulerService } from './scheduler.service';
import { RewardQueueService } from '../services/reward-queue.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueNames.ELIGIBLE_REWARDS,
      defaultJobOptions,
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [SchedulerService, RewardQueueService],
})
export class SchedulerModule {}
