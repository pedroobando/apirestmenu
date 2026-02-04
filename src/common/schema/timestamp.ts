import { timestamp as pgTimestamp } from 'drizzle-orm/pg-core';

export const timestamp = {
  createdAt: pgTimestamp('created_at').defaultNow().notNull(),
  updatedAt: pgTimestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};
