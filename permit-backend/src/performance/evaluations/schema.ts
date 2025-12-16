import { pgTable, serial, integer, text, numeric, timestamp, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../../users/schema";
import { evaluationScores } from "../evaluation-scores/schema";

export const evaluations = pgTable("evaluations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Empleado evaluado
  evaluatorId: integer("evaluator_id").notNull(), // Quien evalúa
  periodType: text("period_type").notNull(), // monthly, quarterly, annual
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  status: text("status").default("draft"), // draft, submitted, reviewed, finalized
  overallScore: numeric("overall_score", { precision: 5, scale: 2 }),
  comments: text("comments"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const evaluationsRelations = relations(evaluations, ({ one, many }) => ({
  user: one(users, {
    fields: [evaluations.userId],
    references: [users.id],
    relationName: "evaluated_user",
  }),
  evaluator: one(users, {
    fields: [evaluations.evaluatorId],
    references: [users.id],
    relationName: "evaluator",
  }),
  scores: many(evaluationScores),
}));

