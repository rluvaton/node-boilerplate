import { faker } from '@faker-js/faker'
import { setupServerAndModify } from '../../../test/helpers/fastify-helper.ts'
import context from '../context.ts'
import sinon from 'sinon'

// More tests exists under the test folder in here
describe('server', () => {
  it('in HTTP route current context should path, method and request id', async () => {
    const route = `/${faker.string.uuid()}`
    const routeCalledWithContext = sinon.spy<(_: { context?: any; requestId: string }) => void>()

    const client = await setupServerAndModify((fastify) => {
      fastify.get(route, (req, reply) => {
        routeCalledWithContext({
          requestId: req.id,
          context: context.getAll(),
        })
        reply.send({})
      })
    })

    await client.axios.get(route)

    expect(routeCalledWithContext).sinonToBeCalledTimes(1)

    // Get the request from the call
    // biome-ignore lint/style/noNonNullAssertion: we checked that the function was called once
    const [{ requestId }] = routeCalledWithContext.lastCall.args
    expect(routeCalledWithContext).sinonToBeCalledWith({
      requestId,
      context: expect.objectContaining({
        path: route,
        method: 'GET',
        request_id: requestId,
      }),
    })
  })
})
