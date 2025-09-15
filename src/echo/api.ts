import type { OurFastifyInstance } from '../lib/http/types.ts'
import {
  PostExampleRequestBody,
  type PostExampleRequestType,
  PostExampleResponseBody,
  type PostExampleResponseType,
} from './types.ts'

export async function echoApi(fastify: OurFastifyInstance) {
  fastify.all('/', async (request) => {
    switch (request.method) {
      case 'GET':
        return { query: request.query }
      case 'POST':
        return { query: request.query, body: request.body }
      case 'PUT':
        return { query: request.query, body: request.body }
      case 'DELETE':
        return { query: request.query }
    }

    return { type: 'unknown' }
  })

  fastify.post<{ Body: PostExampleRequestType; Reply: PostExampleResponseType }>(
    '/example',
    {
      schema: {
        body: PostExampleRequestBody,
        response: {
          200: PostExampleResponseBody,
        },
      },
    },
    async (request) => {
      return {
        type: 'post',
        body: request.body,
      }
    },
  )
}
