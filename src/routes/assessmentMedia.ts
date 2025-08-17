import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { AssessmentMediaController } from '@/controllers/assessmentMedia'
import { AuthMiddleware } from '@/middlewares/auth'

export const routeCreateAssessmentMedia: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/assessment/:movieId',
    {
      preHandler: new AuthMiddleware().userAuth,
      schema: {
        body: z.object({
          liked: z.boolean().default(false),
          unlike: z.boolean().default(false),
        }),
        params: z.object({
          movieId: z.string().min(4),
        }),
      },
    },
    async (req, res) => {
      const { liked, unlike } = req.body
      const { mediaAssessment } =
        await new AssessmentMediaController().createAssessmentMedia({
          MovieId: req.params.movieId,
          userId: req.user.id,
          liked,
          unlike,
        })
      return res.status(201).send({ mediaAssessment })
    }
  )
}

export const routeGetAssessmentMedia: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/assessment/:movieId',
    {
      preHandler: new AuthMiddleware().userAuth,
      schema: {
        params: z.object({
          movieId: z.string().min(4),
        }),
      },
    },
    async (req, res) => {
      const { mediaAssessment } =
        await new AssessmentMediaController().getAssessmentMedia({
          MovieId: req.params.movieId,
          userId: req.user.id,
        })
      return res.status(200).send({ mediaAssessment })
    }
  )
}

export const routeUpdateAssessmentMedia: FastifyPluginCallbackZod = (app) => {
  app.patch(
    '/assessment/:movieId',
    {
      preHandler: new AuthMiddleware().userAuth,
      schema: {
        body: z.object({
          liked: z.boolean().default(false),
          unlike: z.boolean().default(false),
        }),
        params: z.object({
          movieId: z.string().min(4),
        }),
      },
    },
    async (req, res) => {
      const { liked, unlike } = req.body
      const { mediaAssessment } =
        await new AssessmentMediaController().updateAssessmentMedia({
          MovieId: req.params.movieId,
          userId: req.user.id,
          liked,
          unlike,
        })
      return res.status(200).send({ mediaAssessment })
    }
  )
}
