import { pgTable, serial, integer, numeric, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { evaluations } from "../evaluations/schema";
import { performanceIndicators } from "../indicators/schema";

export const evaluationScores = pgTable("evaluation_scores", {
  id: serial("id").primaryKey(),
  evaluationId: integer("evaluation_id").notNull(),
  indicatorId: integer("indicator_id").notNull(),
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  targetValue: numeric("target_value", { precision: 10, scale: 2 }),
  achievementPercentage: numeric("achievement_percentage", { precision: 5, scale: 2 }),
  notes: text("notes"),
});

export const evaluationScoresRelations = relations(evaluationScores, ({ one }) => ({
  evaluation: one(evaluations, {
    fields: [evaluationScores.evaluationId],
    references: [evaluations.id],
  }),
  indicator: one(performanceIndicators, {
    fields: [evaluationScores.indicatorId],
    references: [performanceIndicators.id],
  }),
}));

