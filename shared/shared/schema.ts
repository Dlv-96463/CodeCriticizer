import { z } from "zod";
import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Code analysis results table
export const analyses = pgTable("analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  code: text("code").notNull(),
  language: varchar("language").notNull(),
  filename: varchar("filename"),
  issues: jsonb("issues").notNull().$type<AnalysisIssue[]>(),
  analysisTime: varchar("analysis_time").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const codeAnalysisRequestSchema = z.object({
  code: z.string().min(1, "Code cannot be empty"),
  language: z.string().optional(),
  filename: z.string().optional(),
});

export const analysisIssueSchema = z.object({
  id: z.string(),
  type: z.enum(["error", "improvement", "warning", "security", "style", "documentation"]),
  severity: z.enum(["critical", "high", "medium", "low"]),
  title: z.string(),
  description: z.string(),
  line: z.number(),
  column: z.number().optional(),
  endLine: z.number().optional(),
  endColumn: z.number().optional(),
  suggestion: z.string().optional(),
  category: z.string(),
});

export const codeAnalysisResponseSchema = z.object({
  id: z.string(),
  code: z.string(),
  language: z.string(),
  issues: z.array(analysisIssueSchema),
  analysisTime: z.number(),
  timestamp: z.string(),
});

export const insertUserSchema = createInsertSchema(users);
export const insertAnalysisSchema = createInsertSchema(analyses);

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Analysis = typeof analyses.$inferSelect;
export type CodeAnalysisRequest = z.infer<typeof codeAnalysisRequestSchema>;
export type AnalysisIssue = z.infer<typeof analysisIssueSchema>;
export type CodeAnalysisResponse = z.infer<typeof codeAnalysisResponseSchema>;
