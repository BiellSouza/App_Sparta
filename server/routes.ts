import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Users
  app.post(api.users.create.path, async (req, res) => {
    try {
      const input = api.users.create.input.parse(req.body);
      const existing = await storage.getUserByEmail(input.email);
      if (existing) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const user = await storage.createUser(input);
      res.status(201).json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Trainings
  app.get(api.trainings.list.path, async (req, res) => {
    const trainings = await storage.getTrainings();
    res.json(trainings);
  });

  app.post(api.trainings.create.path, async (req, res) => {
    try {
      const input = api.trainings.create.input.parse(req.body);
      const training = await storage.createTraining(input as any);
      res.status(201).json(training);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Logs
  app.post(api.logs.create.path, async (req, res) => {
    try {
      const input = api.logs.create.input.parse(req.body);
      const log = await storage.createLog(input);
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.logs.list.path, async (req, res) => {
    // In a real app, get userId from session/auth
    // For this mockup, let's just fetch all logs or a specific user's if provided query param
    // But since we are keeping it simple:
    const logs = await storage.getLogs(1); // Mock user ID 1
    res.json(logs);
  });

  // Seed data
  const trainingsList = await storage.getTrainings();
  if (trainingsList.length === 0) {
    await storage.createTraining({
      title: "TREINO DE TIRO",
      description: "O treino deverá ser realizado da seguinte forma: Inicie com aquecimento de 1km sem tempo definido, recupere caminhando por 5 minutos e inicie um tiro de 200 metros (1 volta no florestal) dentro do tempo e pace estimado.",
      durationSeconds: 90,
      isFeatured: true,
    } as any);
  }

  return httpServer;
}
