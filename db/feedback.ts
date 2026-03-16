import { FeedbackMessage } from "@/types";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { speech } from "./speech";

export const feedback = sqliteTable("feedback", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pronunciation: text("pronunciation", { mode: "json" }).$type<
    FeedbackMessage[]
  >(),
  grammar: text("grammar", { mode: "json" }).$type<FeedbackMessage[]>(),
  pace: text("pace", { mode: "json" }).$type<FeedbackMessage[]>(),
  speechId: integer("speech_id")
    .references(() => speech.id)
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export type Feedback = typeof feedback.$inferSelect;
