import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  JWT_SECRET_KEY: z.string().min(8),
})

export const env = envSchema.parse(process.env)
