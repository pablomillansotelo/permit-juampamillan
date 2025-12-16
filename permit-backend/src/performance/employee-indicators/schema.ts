import { pgTable, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../../users/schema";
import { performanceIndicators } from "../indicators/schema";

export const employeeIndicators = pgTable("employee_indicators", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  indicatorId: integer("indicator_id").notNull(),
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
  assignedBy: integer("assigned_by"), // FK a users
  isActive: boolean("is_active").default(true),
});

export const employeeIndicatorsRelations = relations(employeeIndicators, ({ one }) => ({
  user: one(users, {
    fields: [employeeIndicators.userId],
    references: [users.id],
  }),
  indicator: one(performanceIndicators, {
    fields: [employeeIndicators.indicatorId],
    references: [performanceIndicators.id],
  }),
  assignedByUser: one(users, {
    fields: [employeeIndicators.assignedBy],
    references: [users.id],
    relationName: "assigned_by",
  }),
}));

