import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { WatchLaterMediasController } from '@/controllers/watchLaterMedias'
import { AuthMiddleware } from '@/middlewares/auth'

export const routeCreateWatchLaterMedia: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/watch-later',
    {
      preHandler: new AuthMiddleware().userAuth,
      schema: {
        body: z.object({
          MovieId: z.string().min(5),
          image: z.string().url(),
          title: z.string().min(3),
          release: z.coerce.number(),
          type: z.string().min(4),
        }),
      },
    },
    async (req, res) => {
      const { MovieId, image, release, title, type } = req.body
      const { watchLaterId } =
        await new WatchLaterMediasController().createWatchLaterMedia({
          MovieId,
          image,
          release,
          title,
          type,
          userId: req.user.id,
        })
      return res.status(201).send({ watchLaterId })
    }
  )
}

export const routeGetAllWatchLaterMedias: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/watch-later',
    {
      preHandler: new AuthMiddleware().userAuth,
    },
    async (req, res) => {
      const { watchLaterMedias } =
        await new WatchLaterMediasController().getAllWatchLaterMedias({
          userId: req.user.id,
        })
      return res.status(200).send({ watchLaterMedias })
    }
  )
}

export const routeGetWatchLaterMedia: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/watch-later/:movieId',
    {
      preHandler: new AuthMiddleware().userAuth,
      schema: {
        params: z.object({
          movieId: z.string().min(4),
        }),
      },
    },
    async (req, res) => {
      const { watchLaterMedia } =
        await new WatchLaterMediasController().getWatchLaterMedia({
          MovieId: req.params.movieId,
          userId: req.user.id,
        })
      return res.status(200).send({ watchLaterMedia })
    }
  )
}

export const routeDeleteWatchLaterMedia: FastifyPluginCallbackZod = (app) => {
  app.delete(
    '/watch-later/:movieId',
    {
      preHandler: new AuthMiddleware().userAuth,
      schema: {
        params: z.object({
          movieId: z.string().min(4),
        }),
      },
    },
    async (req, res) => {
      const { status } =
        await new WatchLaterMediasController().deleteWatchLaterMedia({
          MovieId: req.params.movieId,
          userId: req.user.id,
        })
      return res.status(200).send({ status })
    }
  )
}
