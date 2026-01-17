// pages/api/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { storage } from '../../server/storage'
import { api } from '@shared/routes'
import { z } from 'zod'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { url, method } = req

    // ---------------- Users ----------------
    if (url?.endsWith('/api/users') && method === 'POST') {
      const input = api.users.create.input.parse(req.body)
      const existing = await storage.getUserByEmail(input.email)
      if (existing)
        return res.status(400).json({ message: 'Email already exists' })
      const user = await storage.createUser(input)
      return res.status(201).json(user)
    }

    if (url?.endsWith('/api/login') && method === 'POST') {
      const { email, password } = api.users.login.input.parse(req.body)
      const user = await storage.getUserByEmail(email)
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' })
      }
      return res.status(200).json(user)
    }

    // ---------------- Trainings ----------------
    if (url?.endsWith('/api/trainings') && method === 'GET') {
      const trainings = await storage.getTrainings()
      return res.status(200).json(trainings)
    }

    if (url?.endsWith('/api/trainings') && method === 'POST') {
      const input = api.trainings.create.input.parse(req.body)
      const training = await storage.createTraining(input as any)
      return res.status(201).json(training)
    }

    // ---------------- Logs ----------------
    if (url?.endsWith('/api/logs') && method === 'GET') {
      const logs = await storage.getLogs(1) // mock userId
      return res.status(200).json(logs)
    }

    if (url?.endsWith('/api/logs') && method === 'POST') {
      const input = api.logs.create.input.parse(req.body)
      const log = await storage.createLog(input)
      return res.status(201).json(log)
    }

    // ---------------- Fallback ----------------
    return res.status(404).json({ message: 'Rota não encontrada' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: err.errors[0].message,
        field: err.errors[0].path.join('.'),
      })
    }
    console.error(err)
    return res.status(500).json({ message: 'Erro interno do servidor' })
  }
}
