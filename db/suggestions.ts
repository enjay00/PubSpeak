import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { speech } from "./speech";

export const suggestions = sqliteTable("suggestions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  suggestion: text("suggestion").notNull(),
  grammarCorrected: text("grammar_corrected").notNull(),
  improved: text("improved", { mode: "json" }).notNull(),
  speechId: integer("speech_id")
    .references(() => speech.id)
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export type Suggestions = typeof suggestions.$inferSelect;
