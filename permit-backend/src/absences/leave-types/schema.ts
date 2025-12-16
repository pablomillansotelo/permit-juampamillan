import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";

export const leaveTypes = pgTable("leave_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // Vacaciones, Enfermedad, etc.
  code: text("code").notNull().unique(), // VAC, ENF, etc.
  maxDaysPerYear: integer("max_days_per_year"), // Máximo de días por año
  carryOverAllowed: boolean("carry_over_allowed").default(false), // Permite arrastre de días
  requiresApproval: boolean("requires_approval").default(true), // Requiere aprobación
  color: text("color"), // Color para calendario (hex)
});

