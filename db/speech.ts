import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const speech = sqliteTable("speech", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  audioUri: text("audio_uri").notNull(),
  transcribe: text("transcribe").notNull(),
  summary: text("summary").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export type Speech = typeof speech.$inferSelect;
