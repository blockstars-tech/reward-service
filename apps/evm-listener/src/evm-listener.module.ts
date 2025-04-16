import { Module } from '@nestjs/common';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { EvmListener } from '@lib/blockchain';
import { SharedModule } from '@lib/shared/modules';
import { EventQueueService } from '@lib/shared/services';
import { defaultJobOptions, networks, QueueNames } from '@lib/shared/config';
import { EvmListenerService } from './evm-listener.service';

@Module({
  imports: [
    SharedModule,
    BullModule.registerQueue({
      name: QueueNames.EVENTS,
      defaultJobOptions,
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [
    EventQueueService,
    {
      provide: 'EVM_SERVICES',
      useFactory: () => {
        const testnetNetworks = Object.values(networks).filter(
          (network) => network.type === 'evm' && network.testnet,
        );

        return testnetNetworks.map((network) => new EvmListener(network));
      },
    },
    {
      provide: 'EVM_LISTENERS',
      useFactory: (
        evmListeners: EvmListener[],
        redisService: RedisService,
        eventQueueService: EventQueueService,
        scheduler: SchedulerRegistry,
      ) => {
        return evmListeners.map((evmListener) => {
          return new EvmListenerService(
            evmListener,
            redisService,
            eventQueueService,
            scheduler,
          );
        });
      },
      inject: [
        'EVM_SERVICES',
        RedisService,
        EventQueueService,
        SchedulerRegistry,
      ],
    },
  ],
})
export class EvmListenerModule {}
