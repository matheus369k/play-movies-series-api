import { eq } from 'drizzle-orm'
import type { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { db } from '@/drizzle/client'
import { schema } from '@/drizzle/schema'
import { env } from '@/util/env'
import { UnAuthorizationError } from './error'

type UserTokenPayloadType = {
  id: string
}

export class AuthMiddleware {
  async userAuth(req: FastifyRequest, _: FastifyReply) {
    const { authorization } = req.headers
    if (!authorization) {
      throw new UnAuthorizationError('User not have permission')
    }

    const token = authorization.split(' ')[1]
    const verifyToken = jwt.verify(
      token,
      env.JWT_SECRET_KEY
    ) as UserTokenPayloadType

    if (!verifyToken) {
      throw new UnAuthorizationError('User not have permission')
    }

    const user = await db
      .select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        avatar: schema.users.avatar,
        createAt: schema.users.createAt,
      })
      .from(schema.users)
      .where(eq(schema.users.id, verifyToken.id))

    if (!user[0]) {
      throw new UnAuthorizationError('User not authorization')
    }

    req.user = user[0]
  }
}
