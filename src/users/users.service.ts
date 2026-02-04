import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from 'src/auth/schema/schema';

@Injectable()
export class UsersService {
  private readonly userSchema = schema.users;
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async getUsers() {
    return this.database.select().from(this.userSchema).orderBy(this.userSchema.email);
  }
}
