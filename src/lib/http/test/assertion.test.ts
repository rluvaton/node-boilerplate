import { faker } from '@faker-js/faker'
import sinon from 'sinon'
import type { ZodAny } from 'zod'
import { z } from 'zod'
import { setupServerAndModify } from '../../../../test/helpers/fastify-helper.ts'

describe('request/response assertion', () => {
  it('should return Bad Request when request body does not match the body schema', async () => {
    const route = `/${faker.string.uuid()}`

    const User = z.object({
      id: z.number(),
    })

    type UserType = z.infer<typeof User>

    const client = await setupServerAndModify((fastify) => {
      fastify.post<{ Body: UserType; Reply: z.infer<ZodAny> }>(
        route,
        {
          schema: {
            body: User,
          },
        },
        (request, reply) => {
          reply.send({})
        },
      )
    })

    const response = await client.axios.post(route, {
      id: 'not a number',
    })

    expect(response).toHaveBadRequestStatus()
    expect(response).toHaveBodyMatchObject({
      message: 'Validation error: Invalid input: expected number, received string at "id"',
    })
  })

  it('should return Server Error when response body does not match the response schema', async () => {
    const routeCalled = sinon.spy()
    const route = `/${faker.string.uuid()}`

    const User = z.object({
      name: z.string(),
      mail: z.string().email().optional(),
    })

    type UserType = z.infer<typeof User>

    const client = await setupServerAndModify((fastify) => {
      fastify.post<{ Body: z.infer<ZodAny>; Reply: UserType }>(
        route,
        {
          schema: {
            response: {
              200: User,
            },
          },
        },
        (request, reply) => {
          routeCalled()

          // @ts-expect-error we don't send the right type on purpose
          reply.send({})
        },
      )
    })

    const response = await client.axios.post(route, {})

    expect(routeCalled).sinonToBeCalled()

    expect(response).toHaveInternalServerErrorStatus()
  })
})
