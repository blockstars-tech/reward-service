import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from './strategies/snake-naming.strategy';
import { SwapEntity } from './entities/swap.entity';
import { TransactionEntity } from './entities/transaction.entity';

export const typeormConfigOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: [SwapEntity, TransactionEntity],
  migrations: [
    join(__dirname, '..', '..', 'libs', 'database', 'migrations', '*{.ts,.js}'),
  ],
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
};

export default new DataSource(typeormConfigOptions as DataSourceOptions);
