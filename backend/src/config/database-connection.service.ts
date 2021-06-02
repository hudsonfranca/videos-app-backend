import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConnectionService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'default',
      type: 'postgres',
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      synchronize: true,
      dropSchema: true,
      logging: false,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      cli: {
        migrationsDir: __dirname + '/../migrations',
        entitiesDir: __dirname + '/../**/*.entity.{js,ts}',
      },
    };
  }
}
