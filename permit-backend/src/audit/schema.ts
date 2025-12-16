import { pgTable, serial, integer, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../users/schema";

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"), // null si es acción del sistema
  action: text("action").notNull(), // create, update, delete, approve, reject, etc.
  entityType: text("entity_type").notNull(), // users, roles, leave_requests, evaluations, etc.
  entityId: integer("entity_id"), // ID de la entidad afectada
  changes: jsonb("changes"), // { before: {...}, after: {...} }
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"), // Información adicional
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

