import { faker } from '@faker-js/faker'
import sinon from 'sinon'
import type { BaseHttpClient } from '../../../../test/helpers/base-http-client.ts'
import { setupServerAndModify } from '../../../../test/helpers/fastify-helper.ts'
import { REQUEST_ID_HEADER } from '../request-id.ts'

describe('request-id', () => {
  const route = `/${faker.string.uuid()}`

  describe('when the response is successful', () => {
    let client: BaseHttpClient
    let requestIdInRequest = sinon.spy()

    before(async () => {
      client = await setupServerAndModify((fastify) => {
        fastify.all(route, (req, reply) => {
          requestIdInRequest(req.id)
          reply.send({})
        })
      })
    })

    // Reset the spy history on `beforeEach` as it is not connected to a sandbox after the first test
    // (probably sinon#restore create a new sandbox, making spies that still exists and orphan)
    beforeEach(() => {
      requestIdInRequest.resetHistory();
    })

    describe.each([
      ['GET', undefined],
      ['POST', {}],
      ['PUT', {}],
      ['PATCH', {}],
      ['DELETE', {}],
      ['HEAD', {}],
      ['OPTIONS', {}],
    ])('%s', (method: string, body: undefined | Record<string, any>) => {
      it('should generate request id when missing in header', async () => {
        await client.axios.request({
          url: route,
          method,
          data: body,
        })

        expect(requestIdInRequest).sinonToBeCalledTimes(1)
        expect(requestIdInRequest).sinonToBeCalledWith(expect.any(String))
      })

      it('should add to the response headers the request id that generated', async () => {
        const response = await client.axios.request({
          url: route,
          method,
          data: body,
        })

        expect(response).toHaveHeader(REQUEST_ID_HEADER, expect.any(String))
      })

      it('should use the request id from header', async () => {
        const requestId = faker.string.uuid()

        await client.axios.request({
          url: route,
          method,
          data: body,
          headers: {
            [REQUEST_ID_HEADER]: requestId,
          },
        })

        expect(requestIdInRequest).sinonToBeCalledTimes(1)
        expect(requestIdInRequest).sinonToBeCalledWith(requestId)
      })

      it('should add to the response headers the request id from header', async () => {
        const requestId = faker.string.uuid()
        const response = await client.axios.request({
          url: route,
          method,
          data: body,
          headers: {
            [REQUEST_ID_HEADER]: requestId,
          },
        })

        expect(response).toHaveHeader(REQUEST_ID_HEADER, requestId)
      })
    })
  })

  describe.each([
    ['exists in the headers', '801d9251-5916-4b26-85d9-7a33aaa86c9d', '801d9251-5916-4b26-85d9-7a33aaa86c9d'],
    ['is missing the headers', undefined, expect.any(String)],
  ])(
    'when the request failed should add request id to the response header when the request id %s',
    (_, requestId, expectedRequestId) => {
      // We test here if it fails on each step of the fastify lifecycle
      it('parsing request failure', async () => {
        const client = await setupServerAndModify((fastify) => {
          fastify.post(route, async () => ({}))
        })

        const response = await client.axios.post(
          route,
          {},
          {
            headers: {
              'Content-Type': 'something that fastify dont know how to parse',
              ...(requestId ? { [REQUEST_ID_HEADER]: requestId } : {}),
            },
          },
        )

        expect(response).not.toBeSuccessful()
        expect(response).toHaveHeader(REQUEST_ID_HEADER, expectedRequestId)
      })

      it('request validation failure', async () => {
        const client = await setupServerAndModify((fastify) => {
          fastify.post(
            route,
            {
              // Require name in the body
              schema: {
                body: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                    },
                  },
                  required: ['name'],
                },
              },
            },
            async () => ({}),
          )
        })

        const response = await client.axios.post(
          route,
          {
            // Not sending name in the body to fail the validation
          },
          {
            headers: requestId ? { [REQUEST_ID_HEADER]: requestId } : {},
          },
        )

        expect(response).not.toBeSuccessful()
        expect(response).toHaveHeader(REQUEST_ID_HEADER, expectedRequestId)
      })

      it('response validation failure', async () => {
        const client = await setupServerAndModify((fastify) => {
          fastify.get(
            route,
            {
              // Require name in the response
              schema: {
                response: {
                  200: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                      },
                    },
                    required: ['name'],
                  },
                },
              },
            },

            // Not returning the name on purpose to fail the response validation
            async () => ({}),
          )
        })

        const response = await client.axios.get(route, {
          headers: requestId ? { [REQUEST_ID_HEADER]: requestId } : {},
        })

        expect(response).not.toBeSuccessful()
        expect(response).toHaveHeader(REQUEST_ID_HEADER, expectedRequestId)
      })
    },
  )
})
