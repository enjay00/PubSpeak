import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { speech } from "./speech";

export const mispronounced = sqliteTable("mispronounced", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  word: text("word").notNull(),
  url: text("url").notNull(),
  localUri: text("local_uri").notNull(),
  phonemes: text("phonemes").notNull(),
  definition: text("definition").notNull(),
  speechId: integer("speech_id")
    .references(() => speech.id)
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export type Mispronounce = typeof mispronounced.$inferSelect;
