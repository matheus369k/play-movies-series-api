import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { db } from '@/drizzle/client'
import { schema } from '@/drizzle/schema'
import {
  BadRequestError,
  ServerError,
  UnAuthorizationError,
} from '@/middlewares/error'
import { env } from '@/util/env'

interface UserControllerType {
  name: string
  email: string
  password: string
}

export class UserController {
  async registerUser({ email, name, password }: UserControllerType) {
    const userRegistered = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))

    if (userRegistered[0]) {
      throw new BadRequestError('This email is already registered.')
    }

    const cryptPass = await bcrypt.hash(password, 10)
    const user = await db
      .insert(schema.users)
      .values({
        name,
        email,
        password: cryptPass,
      })
      .returning()

    const { password: _, ...userRegister } = user[0]
    if (!userRegister) {
      throw new ServerError('Error to try register new user')
    }

    const token = jwt.sign({ id: userRegister.id }, env.JWT_SECRET_KEY)

    return {
      user: userRegister,
      token,
    }
  }

  async userLogin({ email, password }: Omit<UserControllerType, 'name'>) {
    const user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))

    if (!user[0]) {
      throw new BadRequestError('password or email invalid...')
    }

    const verifyPass = await bcrypt.compare(password, user[0].password)
    if (!verifyPass) {
      throw new BadRequestError('password or email invalid...')
    }

    const { password: _, ...userLogin } = user[0]
    const token = jwt.sign({ id: userLogin.id }, env.JWT_SECRET_KEY)

    return {
      user: userLogin,
      token,
    }
  }

  async userUpdate({
    name,
    avatar,
    userId,
  }: Pick<UserControllerType, 'name'> & {
    userId: string | undefined
    avatar: string
  }) {
    if (!userId) {
      throw new UnAuthorizationError('user not authorization')
    }

    const user = await db
      .update(schema.users)
      .set({ name, avatar: avatar || null })
      .where(eq(schema.users.id, userId))
      .returning()

    if (!user[0]) {
      throw new ServerError('Error to try update user')
    }

    return {
      user: user[0],
    }
  }
}
