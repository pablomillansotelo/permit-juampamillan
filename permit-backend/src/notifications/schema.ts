import { pgTable, serial, integer, text, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "../users/schema";

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // leave_request, evaluation, performance, etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: jsonb("data"), // Datos adicionales en formato JSON
  readAt: timestamp("read_at"), // null si no está leída
  actionUrl: text("action_url"), // URL opcional para acción
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const notificationPreferences = pgTable("notification_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  channel: text("channel").notNull(), // email, in-app, push
  notificationType: text("notification_type").notNull(), // leave_request, evaluation, etc.
  enabled: boolean("enabled").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const notificationPreferencesRelations = relations(notificationPreferences, ({ one }) => ({
  user: one(users, {
    fields: [notificationPreferences.userId],
    references: [users.id],
  }),
}));

export const notificationTemplates = pgTable("notification_templates", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // Tipo de notificación
  subject: text("subject"), // Para emails
  body: text("body").notNull(), // Cuerpo del mensaje
  variables: jsonb("variables"), // Variables disponibles para el template
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

