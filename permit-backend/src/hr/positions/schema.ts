import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { departments } from "../departments/schema";

export const positions = pgTable("positions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  departmentId: integer("department_id").references(() => departments.id),
  level: integer("level"), // Nivel jerárquico (1 = más alto, mayor número = más bajo)
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const positionsRelations = relations(positions, ({ one }) => ({
  department: one(departments, {
    fields: [positions.departmentId],
    references: [departments.id],
  }),
}));

