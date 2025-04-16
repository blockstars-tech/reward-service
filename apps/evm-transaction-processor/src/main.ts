import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { EvmTransactionModule } from './transaction-processor.module';

async function bootstrap() {
  const app = await NestFactory.create(EvmTransactionModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch(console.error);
