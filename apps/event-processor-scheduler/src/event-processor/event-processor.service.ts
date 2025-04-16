import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SwapService } from '@lib/database';
import { QueueNames, JobNames } from '@lib/shared/config';
import {
  EventType,
  HtlcEvent,
  HtlcStatus,
  TokenLockedEvent,
  TokenRedeemedEvent,
  TokenRefundedEvent,
} from '@lib/shared/types';
import { RewardQueueService } from '../services/reward-queue.service';

@Processor(QueueNames.EVENTS, { concurrency: 5 })
export class EventProcessorService extends WorkerHost {
  private readonly logger = new Logger(EventProcessorService.name);

  constructor(
    private readonly swapService: SwapService,
    private readonly rewardQueueService: RewardQueueService,
  ) {
    super();
  }

  async process(job: Job<HtlcEvent, any, JobNames>): Promise<any> {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);

    try {
      await this.processEvent(job.data);
    } catch (error) {
      this.logger.error(error, `Failed to process job ${job.id}`);
      throw error;
    }
  }

  private async processEvent(event: HtlcEvent): Promise<void> {
    switch (event.type) {
      case EventType.LOCKED:
        await this.handleTokenLocked(event);
        break;
      case EventType.REDEEMED:
        await this.handleTokenRedeemed(event);
        break;
      case EventType.REFUNDED:
        await this.handleTokenRefunded(event);
        break;
    }
  }

  /**
   * Handles a token locked event by creating or updating a swap.
   *
   * @param {TokenLockedEvent} event The event containing the swap ID and lock details.
   *
   * @returns {Promise<void>}
   */
  private async handleTokenLocked(event: TokenLockedEvent): Promise<void> {
    try {
      await this.swapService.createOrUpdate(event);
    } catch (error) {
      this.logger.error(
        error,
        `Failed to handle TokenLocked event for ID ${event.id}`,
      );
      throw error;
    }
  }

  /**
   * Handles a redeem event by creating or updating a swap.
   *
   * @note This event may occur before the locked event due to network polling intervals, requiring
   * swap creation with partial data.
   *
   * It occurs in two scenarios:
   * 1. Secret revealed on the source network.
   * 2. Claimed on the destination network
   *
   * @param {TokenRedeemedEvent} event The event containing the swap ID and secret.
   *
   * @returns {Promise<void>}
   */
  private async handleTokenRedeemed({
    id,
    secret,
    network,
  }: TokenRedeemedEvent): Promise<void> {
    try {
      const swap = await this.swapService.findById(id);

      if (!swap) {
        await this.swapService.insert({
          id,
          secret,
          status: HtlcStatus.REDEEMED,
        });
        return;
      }

      if (!swap.secret) {
        this.logger.debug(
          `Swap ${id} has no secret, updating with secret and setting status to redeemed`,
        );
        await this.swapService.update(id, {
          secret,
          status: HtlcStatus.REDEEMED,
        });
      } else if (network === swap.dstNetwork) {
        this.logger.debug(`Swap ${id} claimed on destination network`);
        // Delete the swap from the database
        await this.swapService.delete(id);

        // Remove delayed job from queue if it exists
        await this.rewardQueueService.removeJobIfExists(
          this.rewardQueueService.getJobId(id),
        );
      }
    } catch (error) {
      this.logger.error(
        error,
        `Failed to handle TokenRedeemed event for ID ${id}`,
      );
      throw error;
    }
  }

  /**
   * Handles a token refunded event by deleting the swap and removing the job from the queue.
   *
   * @param {TokenRefundedEvent} event The event containing the swap ID.
   *
   * @returns {Promise<void>}
   */
  private async handleTokenRefunded(event: TokenRefundedEvent): Promise<void> {
    try {
      await this.swapService.delete(event.id);

      // Remove delayed job from queue if it exists
      await this.rewardQueueService.removeJobIfExists(
        this.rewardQueueService.getJobId(event.id),
      );
    } catch (error) {
      this.logger.error(
        error,
        `Failed to handle TokenRefunded event for ID ${event.id}`,
      );
      throw error;
    }
  }
}
