import { pgTable, integer, serial, text, timestamp, date, numeric, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { userRoles } from "../user-roles/schema";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  // Campos HR
  employeeId: text("employee_id").unique(),
  hireDate: date("hire_date"),
  positionId: integer("position_id"), // FK a positions - referencia definida en migración
  departmentId: integer("department_id"), // FK a departments - referencia definida en migración
  managerId: integer("manager_id"), // Self-reference - referencia definida en migración
  employmentType: text("employment_type"), // full-time, part-time, contractor, intern
  status: text("status").default("active"), // active, inactive, on-leave, terminated
  phone: text("phone"),
  address: text("address"),
  birthDate: date("birth_date"),
  emergencyContact: jsonb("emergency_contact"), // { name, phone, relationship }
  salary: numeric("salary", { precision: 10, scale: 2 }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  userRoles: many(userRoles),
  manager: one(users, {
    fields: [users.managerId],
    references: [users.id],
    relationName: "manager",
  }),
  subordinates: many(users, {
    relationName: "manager",
  }),
  // Nota: Las relaciones con positions y departments se pueden definir
  // en los schemas respectivos para evitar dependencias circulares
}));