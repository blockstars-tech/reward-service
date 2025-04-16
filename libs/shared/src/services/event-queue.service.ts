import { Injectable, Logger } from '@nestjs/common';
import { BulkJobOptions, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { HtlcEvent } from '@lib/shared/types';
import { JobNames, QueueNames } from '../config';

@Injectable()
export class EventQueueService {
  private readonly logger = new Logger(EventQueueService.name);

  constructor(@InjectQueue(QueueNames.EVENTS) private htlcEventQueue: Queue) {}

  /**
   * Add a job to the queue
   *
   * @param {string} name Name of the job
   * @param {HtlcEvent} event The event to add
   *
   * @returns {Promise<void>}
   */
  async addJob(name: string, event: HtlcEvent): Promise<void> {
    await this.htlcEventQueue.add(name, event);
    this.logger.debug(`Added ${name} job to the queue for event: ${event.id}`);
  }

  /**
   * Add a job to the queue with options
   *
   * @param {string} name Name of the job
   * @param {HtlcEvent} event The event to add
   * @param {BulkJobOptions} opts Options for the job
   *
   * @returns {Promise<void>}
   */
  async addBulk(
    data: {
      name: JobNames;
      data: HtlcEvent;
      opts?: BulkJobOptions;
    }[],
  ): Promise<void> {
    await this.htlcEventQueue.addBulk(data);
  }
}
