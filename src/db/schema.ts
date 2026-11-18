import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  currency: text("currency").default("USD").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull(),
});

export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: text("type", { enum: ["INCOME", "EXPENSE"] }).notNull(),
    icon: text("icon").default("wallet").notNull(),
    color: text("color").default("#10b981").notNull(),
    isDefault: integer("is_default", { mode: "boolean" }).default(false).notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (table) => ({
    userTypeIdx: index("idx_categories_user_type").on(table.userId, table.type),
  })
);

export const transactions = sqliteTable(
  "transactions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    type: text("type", { enum: ["INCOME", "EXPENSE"] }).notNull(),
    amount: real("amount").notNull(),
    date: integer("date").notNull(), // timestamp (ms)
    description: text("description"),
    paymentMethod: text("payment_method", { enum: ["CASH", "CARD", "TRANSFER"] })
      .default("CARD")
      .notNull(),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (table) => ({
    userDateIdx: index("idx_transactions_user_date").on(table.userId, table.date),
    categoryIdx: index("idx_transactions_category").on(table.categoryId),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
