import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import { User } from './user/user.entity';
import { Video } from './video/video.entity';

const PROD_ENV = 'production';

const config = {
  host: '172.20.0.2',
  user: 'admin',
  password: 'admin',
  database: 'postgres',
};

const connectionOptions: ConnectionOptions = {
  type: 'postgres',
  host: config.host,
  port: 5432,
  username: config.user || 'postgres',
  password: config.password || '123456789',
  database: config.database || 'vivubook-dev',
  entities: [User, Video],
  // We are using migrations, synchronize should be set to false.
  synchronize: true,
  dropSchema: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  logging: ['warn', 'error'],
  logger: process.env.NODE_ENV === PROD_ENV ? 'file' : 'debug',
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export = connectionOptions;
