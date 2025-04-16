import { Module } from '@nestjs/common';
import { DatabaseModule } from '@lib/database';
import { SharedModule } from '@lib/shared';
import { EventProcessorModule } from './event-processor/event-processor.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    SharedModule,
    DatabaseModule,
    EventProcessorModule,
    SchedulerModule,
  ],
})
export class AppModule {}
