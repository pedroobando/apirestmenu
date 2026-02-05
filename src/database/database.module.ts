import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DATABASE_CONNECTION } from './database-connection';

import * as userSchema from 'src/auth/schema/schema';
import * as categorySchema from 'src/menu-category/schema';
import * as menuSchema from 'src/menu-digital/schema';

// export const DRIZZLE = Symbol('drizzle-connection');

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseURL = configService.getOrThrow<string>('DATABASE_URL');
        const pool = new Pool({
          connectionString: databaseURL,
          ssl: false,
        });
        return drizzle(pool, {
          schema: { ...userSchema, ...categorySchema, ...menuSchema },
        });
      },
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
