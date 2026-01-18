import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

/* =======================
   USERS
======================= */

import { uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  password: text('password').notNull(),
})

/**
 * ✅ Schema de INSERT MANUAL
 * - id NÃO vem do front
 * - evita conflito number vs string
 */
export const insertUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

/* =======================
   TRAININGS
======================= */

export const trainings = pgTable('trainings', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  durationSeconds: integer('duration_seconds'),
  pace: text('pace'),
  tempo: text('tempo'),
  reps: text('reps'),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

export const insertTrainingSchema = createInsertSchema(trainings).omit({
  id: true,
  createdAt: true,
})

/* =======================
   TRAINING LOGS
======================= */

export const trainingLogs = pgTable('training_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  trainingId: integer('training_id').notNull(),
  date: timestamp('date').defaultNow(),
  startTime: text('start_time'), // "HH:mm"
  endTime: text('end_time'), // "HH:mm"
  keptPace: boolean('kept_pace').default(false),
  withinTime: boolean('within_time').default(false),
  allReps: boolean('all_reps').default(false),
  notes: text('notes'),
})

export const insertTrainingLogSchema = createInsertSchema(trainingLogs).omit({
  id: true,
})

/* =======================
   TYPES
======================= */

export type User = typeof users.$inferSelect
export type InsertUser = z.infer<typeof insertUserSchema>

export type Training = typeof trainings.$inferSelect
export type TrainingLog = typeof trainingLogs.$inferSelect
export type InsertTrainingLog = z.infer<typeof insertTrainingLogSchema>
