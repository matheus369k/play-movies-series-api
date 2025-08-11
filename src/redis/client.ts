import { Redis } from 'ioredis'
import { env } from '@/util/env'

export const redis = new Redis(env.REDIS_URL)
