// import { relations } from 'drizzle-orm';

import { relations } from 'drizzle-orm';
import { pgTable, uuid, text, boolean, doublePrecision } from 'drizzle-orm/pg-core';
import { timestamp } from 'src/common/schema/timestamp';
import { users } from 'src/auth/schema';
import { menuCategories } from 'src/menu-category/schema';

export const menuDigitals = pgTable('menu_digitals', {
  id: uuid().primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  price: doublePrecision('price').notNull().default(0),
  categoryId: uuid('category_id')
    .references(() => menuCategories.id)
    .notNull(),
  badges: text('badges').array().notNull().default([]),
  isSuggestion: boolean('is_suggestio').default(false).notNull(),
  isCustomMenu: boolean('is_custom_menu').default(false).notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  ...timestamp,
});

// relacion uno a muchos
export const menuDigitalRelations = relations(menuDigitals, ({ one }) => ({
  categories: one(menuCategories, {
    fields: [menuDigitals.categoryId],
    references: [menuCategories.id],
  }),

  users: one(users, {
    fields: [menuDigitals.userId],
    references: [users.id],
  }),
}));
