import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

