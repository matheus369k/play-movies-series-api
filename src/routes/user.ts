import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { UserController } from '@/controllers/user'
import { AuthMiddleware } from '@/middlewares/auth'
import { UploadMiddleware } from '@/middlewares/upload'

export const routeCreateUser: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/users/register',
    {
      schema: {
        body: z.object({
          name: z.string().min(3),
          email: z.email(),
          password: z.string().min(8),
        }),
      },
    },
    async (req, res) => {
      const { email, name, password } = req.body
      const { user, token } = await new UserController().registerUser({
        email,
        name,
        password,
      })
      return res.status(201).send({
        user,
        token,
      })
    }
  )
}

export const routeLoginUser: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/users/login',
    {
      schema: {
        body: z.object({
          email: z.email(),
          password: z.string().min(8),
        }),
      },
    },
    async (req, res) => {
      const { email, password } = req.body
      const { user, token } = await new UserController().userLogin({
        email,
        password,
      })
      return res.status(201).send({
        user,
        token,
      })
    }
  )
}

export const routeProfileUser: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/users/profile',
    { preHandler: new AuthMiddleware().userAuth },
    (req, res) => {
      return res.status(200).send({
        user: req.user,
      })
    }
  )
}

export const routeUpdateUser: FastifyPluginCallbackZod = (app) => {
  app.patch(
    '/users/update',
    {
      preHandler: [
        new AuthMiddleware().userAuth,
        new UploadMiddleware().uploads.single('file'),
      ],
    },
    async (req, res) => {
      const { user } = await new UserController().userUpdate({
        userId: req.user.id,
        name: (req.body as unknown as { name: string }).name,
        avatar: (req.file as unknown as { path: string }).path,
      })
      return res.status(201).send({
        user,
      })
    }
  )
}
