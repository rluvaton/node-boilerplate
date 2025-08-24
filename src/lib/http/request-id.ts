import { randomUUID } from 'node:crypto'
import fp from 'fastify-plugin'

export const REQUEST_ID_HEADER = 'x-request-id'

export function generateRequestId() {
  return randomUUID()
}

// This must be added to the start
export default fp(
  async function (fastify) {
    fastify.addHook('onRequest', (req, reply, next) => {
      reply.header(REQUEST_ID_HEADER, req.id)
      next()
    })
  },
  {
    fastify: '5.x',
    name: 'fastify-request-id',

    // Don't encapsulate so we will have the request id on the root
    encapsulate: false,
  },
)
