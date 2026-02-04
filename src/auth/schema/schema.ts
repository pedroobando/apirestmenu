// import { relations } from 'drizzle-orm';

import { relations } from 'drizzle-orm';
import { pgTable, uuid, text, boolean } from 'drizzle-orm/pg-core';
import { timestamp } from 'src/common/schema/timestamp';
import { menuCategories } from 'src/menu-category/schema';

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(),
  active: boolean('active').default(true),
  ...timestamp,
});

export const usersRelations = relations(users, ({ many }) => ({
  menuCategories: many(menuCategories),
}));
