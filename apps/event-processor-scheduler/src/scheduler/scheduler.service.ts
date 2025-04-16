import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SwapService } from '@lib/database';
import { JobNames, NetworkName, networks } from '@lib/shared/config';
import { SwapDto } from '@lib/shared/dtos';
import { RewardQueueService } from '../services/reward-queue.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly swapService: SwapService,
    private readonly rewardQueueService: RewardQueueService,
  ) {}

  /**
   * This method runs every 2 minutes and checks for eligible swaps
   * which rewards can be claimed, and enqueues them for processing.
   *
   * @returns {Promise<void>}
   */
  @Cron('*/2 * * * *', {
    name: 'ScheduleEligibleSwaps',
  })
  async scheduleEligibleSwaps(): Promise<void> {
    try {
      console.time('scheduleEligibleSwaps');
      const eligibleSwaps = await this.swapService.findEligibleSwaps();
      console.timeEnd('scheduleEligibleSwaps');

      if (!eligibleSwaps.length) {
        this.logger.debug('No eligible swaps found');
        return;
      }

      this.logger.debug(
        `Found ${eligibleSwaps.length} eligible swaps to claim rewards`,
      );

      const scheduledSwapIds: string[] = [];

      for (const swap of eligibleSwaps) {
        const { id, secret, dstNetwork, rewardTimelock } = swap;

        if (!secret || !dstNetwork) {
          this.logger.error(
            {
              secret,
              dstNetwork,
            },
            `Invalid swap data for swap id: ${id}`,
          );
          continue;
        }

        const jobId = this.rewardQueueService.getJobId(id);

        if (await this.rewardQueueService.isJobActive(jobId)) {
          this.logger.debug(`Job for swap ${id} is already active. Skipping.`);
          continue;
        }

        const jobData: SwapDto = {
          id,
          secret,
          network: dstNetwork as NetworkName,
        };
        const delay = this.calculateDelay(
          Number(rewardTimelock),
          jobData.network,
        );

        await this.rewardQueueService.addJob(
          JobNames.PROCESS_EVM_ELIGIBLE_REWARDS,
          jobData,
          {
            jobId,
            delay,
          },
        );

        scheduledSwapIds.push(id);
      }

      if (scheduledSwapIds.length) {
        this.logger.debug(
          `Scheduled swaps for reward claim: ${scheduledSwapIds.join(', ')}`,
        );

        await this.swapService.updateByIds(scheduledSwapIds, {
          scheduledAt: new Date(),
        });
      }
    } catch (error) {
      this.logger.error('Failed to schedule eligible swaps', error);
    }
  }

  /**
   * Calculates the delay for the job based on the reward timelock.
   *
   * @param {number} rewardTimelock The reward timelock in seconds.
   * @param {NetworkName} networkName The name of the network.
   *
   * @returns {number} The delay in milliseconds.
   */
  private calculateDelay(
    rewardTimelock: number,
    networkName: NetworkName,
  ): number {
    const now = Date.now();
    const bufferInSeconds = networks[networkName].claimBufferInSec || 2;

    return Math.max(0, (rewardTimelock - bufferInSeconds) * 1000 - now);
  }
}
