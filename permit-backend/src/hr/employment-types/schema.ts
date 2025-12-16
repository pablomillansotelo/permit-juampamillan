import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const employmentTypes = pgTable("employment_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // full-time, part-time, contractor, intern
  description: text("description"),
});

