import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { resources } from "../resources/schema.js";
import { relations } from "drizzle-orm";

export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  action: text("action").notNull(), // e.g., "read", "write", "delete", "update"
  resourceId: integer("resource_id").notNull().references(() => resources.id, { onDelete: "cascade" }),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const permissionsRelations = relations(permissions, ({ one }) => ({
  resource: one(resources, {
    fields: [permissions.resourceId],
    references: [resources.id],
  }),
}));

