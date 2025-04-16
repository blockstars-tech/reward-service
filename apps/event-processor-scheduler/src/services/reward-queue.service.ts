import { Injectable, Logger } from '@nestjs/common';
import { JobNames, QueueNames } from '../../../../libs/shared/src';
import { Job, JobsOptions, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class RewardQueueService {
  private readonly logger = new Logger(RewardQueueService.name);

  constructor(
    @InjectQueue(QueueNames.ELIGIBLE_REWARDS) private rewardQueue: Queue,
  ) {}

  getJobId(id: string): string {
    return `swap:${id}`;
  }

  async addJob(
    name: JobNames,
    jobData: any,
    jobOptions?: JobsOptions,
  ): Promise<void> {
    await this.rewardQueue.add(name, jobData, jobOptions);
  }

  async isJobActive(jobId: string): Promise<boolean> {
    const job = (await this.rewardQueue.getJob(jobId)) as Job;

    return job ? (await job.isActive()) || (await job.isDelayed()) : false;
  }

  async removeJobIfExists(jobId: string): Promise<void> {
    const job = (await this.rewardQueue.getJob(jobId)) as Job;

    if (job) {
      await job.remove();
      this.logger.debug(`Removed job with ID: ${jobId}`);
    }
  }
}
