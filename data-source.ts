import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { typeormConfigOptions } from './libs/database/src/typeorm.config';

const dataSourceOptions = {
  ...typeormConfigOptions,
  entities: [__dirname + '/libs/database/src/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/libs/database/src/migrations/*{.ts,.js}'],
};

export default new DataSource(dataSourceOptions as DataSourceOptions);
