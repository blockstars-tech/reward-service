import { DefaultJobOptions } from 'bullmq';

export enum QueueNames {
  EVENTS = 'events-queue',
  ELIGIBLE_REWARDS = 'eligible-rewards-queue',
}

export enum JobNames {
  PROCESS_EVENT = 'process-htlc-event',
  PROCESS_EVM_ELIGIBLE_REWARDS = 'process-evm-eligible-rewards',
}

/**
 * Default job options for BullMQ jobs
 */
export const defaultJobOptions: DefaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
  removeOnComplete: true,
  removeOnFail: true,
};

/**
 * Get job options with custom options overriding the default ones
 */
export const getJobOptions = (
  customOptions: Partial<DefaultJobOptions> = {},
): DefaultJobOptions => {
  return {
    ...defaultJobOptions,
    ...customOptions,
  };
};
