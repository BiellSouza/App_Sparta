import { users, trainings, trainingLogs, type User, type InsertUser, type Training, type TrainingLog, type InsertTrainingLog } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Trainings
  getTrainings(): Promise<Training[]>;
  createTraining(training: Training): Promise<Training>; // usually seeded

  // Logs
  createLog(log: InsertTrainingLog): Promise<TrainingLog>;
  getLogs(userId: number): Promise<TrainingLog[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getTrainings(): Promise<Training[]> {
    return await db.select().from(trainings);
  }

  async createTraining(training: Training): Promise<Training> {
    const [newTraining] = await db.insert(trainings).values(training).returning();
    return newTraining;
  }

  async createLog(log: InsertTrainingLog): Promise<TrainingLog> {
    const [newLog] = await db.insert(trainingLogs).values(log).returning();
    return newLog;
  }

  async getLogs(userId: number): Promise<TrainingLog[]> {
    return await db.select().from(trainingLogs).where(eq(trainingLogs.userId, userId));
  }
}

export const storage = new DatabaseStorage();
