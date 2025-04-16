import Redis from 'ioredis';
import { CronJob } from 'cron';
import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { EvmListener } from '@lib/blockchain';
import { networks, JobNames, NetworkConfig } from '@lib/shared/config';
import { generateBlockRanges } from '@lib/shared/utils';
import { EventQueueService } from '@lib/shared/services';

@Injectable()
export class EvmListenerService {
  private readonly logger = new Logger(EvmListenerService.name);
  private readonly redis: Redis;
  private readonly network: NetworkConfig;

  constructor(
    private readonly evmListener: EvmListener,
    private readonly redisService: RedisService,
    private readonly eventQueueService: EventQueueService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    try {
      this.network = this.evmListener.networkConfig;
      this.redis = this.redisService.getOrThrow();
      this.scheduleJob();
    } catch (error) {
      this.logger.error('Failed to connect to Redis:', error);
    }
  }

  /**
   * Schedule a job to fetch and process events based on the network's polling interval
   *
   * @returns {void}
   */
  scheduleJob(): void {
    const networkName = this.network.name;
    const pollingIntervalMin = networks[networkName].pollingIntervalMin;
    const cronExpression = `0 */${pollingIntervalMin} * * * *`;
    const job = new CronJob(cronExpression, () => this.fetchAndProcessEvents());

    this.schedulerRegistry.addCronJob(`fetchEvents:${networkName}`, job);

    job.start();

    this.logger.debug(
      `Scheduled job for ${networkName} with interval ${pollingIntervalMin} minutes`,
    );
  }

  /**
   * Fetch event by block range and add to the queue
   *
   * @returns {Promise<void>}
   */
  async fetchAndProcessEvents(): Promise<void> {
    const chainId = this.network.chainId;
    const networkName = this.network.name;

    try {
      const latestBlock = await this.evmListener.getCurrentBlockNumber();
      const lastProcessedBlock =
        (await this.getLastProcessedBlock(chainId)) || latestBlock;

      if (lastProcessedBlock >= latestBlock) {
        this.logger.debug(`[${networkName}] No new blocks to process`);

        return;
      }

      const ranges = generateBlockRanges(
        lastProcessedBlock + 1,
        latestBlock,
        this.network.blockRange,
      );
      this.logger.log(
        `[${networkName}] Fetching events from blocks ${ranges[0].fromBlock} to ${ranges[ranges.length - 1].toBlock}`,
      );

      for (const { fromBlock, toBlock } of ranges) {
        const events = await this.evmListener.getEventLogs(fromBlock, toBlock);

        this.logger.debug(`[${networkName}] Found ${events.length} events`);
        this.logger.log(events);

        if (events.length > 0) {
          await this.eventQueueService.addBulk(
            events.map((event) => ({
              name: JobNames.PROCESS_EVENT,
              data: event,
            })),
          );
        }
      }

      await this.updateLastProcessedBlock(chainId, latestBlock);
    } catch (error) {
      this.logger.error(
        error,
        `Error fetching events for chain ${networkName}:`,
      );
    }
  }

  /**
   * Get the last processed block number for a given chain
   *
   * @param {number} chainId
   *
   * @returns {Promise<number>}
   */
  private async getLastProcessedBlock(chainId: number): Promise<number> {
    const key = `lastProcessedBlock:${chainId}`;
    const value = Number(await this.redis.get(key));

    return value || 0;
  }

  /**
   * Update the last processed block number for a given chain
   *
   * @param {number} chainId
   * @param {number} blockNumber
   */
  private async updateLastProcessedBlock(
    chainId: number,
    blockNumber: number,
  ): Promise<void> {
    const key = `lastProcessedBlock:${chainId}`;
    await this.redis.set(key, blockNumber);
  }
}
