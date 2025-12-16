import { pgTable, serial, text, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";

export const evaluationTemplates = pgTable("evaluation_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  indicatorIds: jsonb("indicator_ids"), // Array de IDs de indicadores
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

