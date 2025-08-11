import type { Config } from 'drizzle-kit'
import { env } from '@/util/env'

export default {
  schema: 'src/drizzle/schema/*',
  out: 'src/drizzle/migrations',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: { url: env.DATABASE_URL },
} satisfies Config
