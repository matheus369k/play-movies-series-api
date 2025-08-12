import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from '@/util/env'
import { routeCreateUser, routeLoginUser, routeProfileUser } from './routes'

const app = fastify().withTypeProvider<ZodTypeProvider>()

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

app.listen({ port: env.PORT })
