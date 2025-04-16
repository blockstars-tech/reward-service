import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { EvmListenerModule } from './evm-listener.module';

async function bootstrap() {
  const app = await NestFactory.create(EvmListenerModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch(console.error);
