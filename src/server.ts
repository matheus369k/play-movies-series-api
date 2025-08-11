import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from '@/util/env'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.get('/hearth', (req, res) => {
  return res.send({ status: 'ok' })
})

app.listen({ port: env.PORT }, () => {
  console.log('Serve running..')
})
