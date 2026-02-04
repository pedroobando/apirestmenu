// import { relations } from 'drizzle-orm';

import { relations } from 'drizzle-orm';
import { pgTable, uuid, text, boolean, integer } from 'drizzle-orm/pg-core';
import { timestamp } from 'src/common/schema/timestamp';
import { users } from 'src/auth/schema';
import { menuDigitals } from 'src/menu-digital/schema';

export const menuCategories = pgTable('menu_categories', {
  id: uuid().primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  orderInMenu: integer('order_in_menu').notNull().default(0),
  isActive: boolean('is_active').default(true).notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ...timestamp,
});

// relacion uno a muchos
export const menuCategoryRelations = relations(menuCategories, ({ one, many }) => ({
  users: one(users, {
    fields: [menuCategories.userId],
    references: [users.id],
  }),

  menuDigitals: many(menuDigitals),
}));
