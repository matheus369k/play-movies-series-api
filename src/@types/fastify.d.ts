import 'fastify'

export type FastifyRequestUserType = {
  id: string
  profileImage: string | null
  name: string
  email: string
  createAt: Date
}

declare module 'fastify' {
  export interface FastifyRequest {
    user: Partial<FastifyRequestUserType>
  }
}
