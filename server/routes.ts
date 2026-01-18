import type { Express } from 'express'
import type { Server } from 'http'
import { storage } from './storage'
import { api } from '@shared/routes'
import { z } from 'zod'
import { insertUserSchema } from '@shared/schema'

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // Users
  app.post(api.users.create.path, async (req, res) => {
    try {
      console.log('Recebido do front-end:', req.body)

      // ✅ Use schema que omite o id
      const input = insertUserSchema.parse(req.body)
      console.log('Validado:', input)

      const existing = await storage.getUserByEmail(input.email)
      if (existing) {
        return res.status(400).json({ message: 'Email already exists' })
      }

      const user = await storage.createUser(input)
      res.status(201).json(user)
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        })
      }
      console.error(err)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  })

  app.post(api.users.login.path, async (req, res) => {
    try {
      const { email, password } = api.users.login.input.parse(req.body)
      const user = await storage.getUserByEmail(email)
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }
      res.json(user)
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        })
      }
      throw err
    }
  })

  // Trainings
  app.get(api.trainings.list.path, async (req, res) => {
    const trainings = await storage.getTrainings()
    res.json(trainings)
  })

  // app.post(api.trainings.create.path, async (req, res) => {
  //   try {
  //     const input = api.trainings.create.input.parse(req.body)
  //     const training = await storage.createTraining(input as any)
  //     res.status(201).json(training)
  //   } catch (err) {
  //     if (err instanceof z.ZodError) {
  //       return res.status(400).json({
  //         message: err.errors[0].message,
  //         field: err.errors[0].path.join('.'),
  //       })
  //     }
  //     throw err
  //   }
  // })
  app.post(api.trainings.create.path, async (req, res) => {
    try {
      const input = api.trainings.create.input.parse(req.body)

      // 1️⃣ Remove destaque de todos
      await storage.unfeatureAllTrainings()

      // 2️⃣ Cria o novo como destaque
      const training = await storage.createTraining({
        ...input,
        isFeatured: true,
      } as any)

      res.status(201).json(training)
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        })
      }
      throw err
    }
  })

  // Logs
  // app.post(api.logs.create.path, async (req, res) => {
  //   try {
  //     const input = api.logs.create.input.parse(req.body)
  //     const log = await storage.createLog(input)
  //     res.status(201).json(log)
  //   } catch (err) {
  //     if (err instanceof z.ZodError) {
  //       return res.status(400).json({
  //         message: err.errors[0].message,
  //         field: err.errors[0].path.join('.'),
  //       })
  //     }
  //     throw err
  //   }
  // })

  app.post(api.logs.create.path, async (req, res) => {
    try {
      // Clona o body
      const inputRaw = { ...req.body }

      // Converte string ISO em Date
      if (inputRaw.date) {
        const parsedDate = new Date(inputRaw.date)
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            message: 'Invalid date',
            field: 'date',
          })
        }
        inputRaw.date = parsedDate
      }

      // Converte startTime e endTime em Date, se existirem
      const today = inputRaw.date?.toISOString().split('T')[0]
      if (inputRaw.startTime && today) {
        inputRaw.startTime = new Date(`${today}T${inputRaw.startTime}`)
      }
      if (inputRaw.endTime && today) {
        inputRaw.endTime = new Date(`${today}T${inputRaw.endTime}`)
      }

      // Valida novamente com Zod (se necessário)
      const input = api.logs.create.input.parse(inputRaw)

      const log = await storage.createLog(input)
      res.status(201).json(log)
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        })
      }
      throw err
    }
  })

  app.get(api.logs.list.path, async (req, res) => {
    // In a real app, get userId from session/auth
    // For this mockup, let's just fetch all logs or a specific user's if provided query param
    // But since we are keeping it simple:
    const logs = await storage.getLogs(1) // Mock user ID 1
    res.json(logs)
  })

  // Seed data
  const trainingsList = await storage.getTrainings()
  if (trainingsList.length === 0) {
    await storage.createTraining({
      title: 'TREINO DE TIRO',
      description:
        'O treino deverá ser realizado da seguinte forma: Inicie com aquecimento de 1km sem tempo definido, recupere caminhando por 5 minutos e inicie um tiro de 200 metros (1 volta no florestal) dentro do tempo e pace estimado.',
      durationSeconds: 90,
      isFeatured: true,
    } as any)
  }

  return httpServer
}
