import { z } from 'zod';
import { insertUserSchema, insertTrainingLogSchema, insertTrainingSchema, trainings, trainingLogs } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  users: {
    create: {
      method: 'POST' as const,
      path: '/api/users',
      input: insertUserSchema,
      responses: {
        201: z.object({ id: z.number(), name: z.string() }),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ email: z.string(), password: z.string() }),
      responses: {
        200: z.object({ id: z.number(), name: z.string() }),
        401: z.object({ message: z.string() }),
        400: errorSchemas.validation,
      },
    },
  },
  trainings: {
    list: {
      method: 'GET' as const,
      path: '/api/trainings',
      responses: {
        200: z.array(z.custom<typeof trainings.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/trainings',
      input: insertTrainingSchema,
      responses: {
        201: z.custom<typeof trainings.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  logs: {
    create: {
      method: 'POST' as const,
      path: '/api/logs',
      input: insertTrainingLogSchema,
      responses: {
        201: z.custom<typeof trainingLogs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/logs',
      responses: {
        200: z.array(z.custom<typeof trainingLogs.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
