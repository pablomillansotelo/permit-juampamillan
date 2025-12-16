import { pgTable, serial, text, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../../users/schema";
import { employeeIndicators } from "../employee-indicators/schema";
import { evaluationScores } from "../evaluation-scores/schema";

export const performanceIndicators = pgTable("performance_indicators", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // numeric, percentage, boolean, text
  unit: text("unit"), // opcional: %, unidades, etc.
  targetValue: numeric("target_value", { precision: 10, scale: 2 }),
  weight: numeric("weight", { precision: 5, scale: 2 }).default("1.00"), // Para promedios ponderados
  category: text("category"), // Ej: "Ventas", "Calidad", "Productividad"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const performanceIndicatorsRelations = relations(performanceIndicators, ({ many }) => ({
  employeeIndicators: many(employeeIndicators),
  evaluationScores: many(evaluationScores),
}));

