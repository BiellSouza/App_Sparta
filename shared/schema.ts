import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (for the "Preencha com seus dados" screen)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // In a real app, hash this!
});

// Trainings (for the "Treino de Tiro" cards)
export const trainings = pgTable("trainings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // e.g., "TREINO DE TIRO"
  description: text("description").notNull(),
  durationSeconds: integer("duration_seconds"),
  isFeatured: boolean("is_featured").default(false),
});

// Logs (for "Meu Histórico")
export const trainingLogs = pgTable("training_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // simplified relation
  trainingId: integer("training_id").notNull(), // simplified relation
  date: timestamp("date").defaultNow(),
  keptPace: boolean("kept_pace").default(false),
  withinTime: boolean("within_time").default(false),
  allReps: boolean("all_reps").default(false),
  notes: text("notes"),
});

export const insertUserSchema = createInsertSchema(users);
export const insertTrainingSchema = createInsertSchema(trainings);
export const insertTrainingLogSchema = createInsertSchema(trainingLogs);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Training = typeof trainings.$inferSelect;
export type TrainingLog = typeof trainingLogs.$inferSelect;
export type InsertTrainingLog = z.infer<typeof insertTrainingLogSchema>;
