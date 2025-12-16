import { pgTable, serial, integer, unique } from "drizzle-orm/pg-core";
import { users } from "../../users/schema";
import { leaveTypes } from "../leave-types/schema";

export const leaveBalances = pgTable("leave_balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  leaveTypeId: integer("leave_type_id").notNull().references(() => leaveTypes.id),
  year: integer("year").notNull(), // Año del balance
  totalDays: integer("total_days").notNull().default(0),
  usedDays: integer("used_days").notNull().default(0),
  remainingDays: integer("remaining_days").notNull().default(0),
  carriedOverDays: integer("carried_over_days").notNull().default(0),
}, (table) => ({
  uniqueUserLeaveYear: unique().on(table.userId, table.leaveTypeId, table.year),
}));

