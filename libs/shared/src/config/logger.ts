import type { Params } from 'nestjs-pino';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

export const loggerOptions: Params = {
  pinoHttp: {
    level: LOG_LEVEL,
    ...(LOG_LEVEL === 'debug'
      ? {
          transport: {
            target: 'pino-pretty',
            options: { colorize: true, singleLine: true },
          },
        }
      : {}),
  },
};
