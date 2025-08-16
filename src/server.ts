import path from 'node:path'
import fastifyCors from '@fastify/cors'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from '@/util/env'
import {
  routeCreateUser,
  routeLoginUser,
  routeProfileUser,
  routeUpdateUser,
} from './routes/user'
import {
  routeCreateWatchLaterMedia,
  routeDeleteWatchLaterMedia,
  routeGetAllWatchLaterMedias,
  routeGetWatchLaterMedia,
} from './routes/watchLaterMedias'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: env.WEB_URL,
})
app.register(fastifyMultipart)
app.register(fastifyStatic, {
  root: path.join(path.dirname(__dirname), 'public'),
  prefix: '/public/',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.get('/hearth', (_, res) => {
  return res.send({
    status: 'ok',
  })
})

app.register(routeCreateUser)
app.register(routeLoginUser)
app.register(routeProfileUser)
app.register(routeUpdateUser)

app.register(routeCreateWatchLaterMedia)
app.register(routeGetAllWatchLaterMedias)
app.register(routeGetWatchLaterMedia)
app.register(routeDeleteWatchLaterMedia)

app.listen({ port: env.PORT })
