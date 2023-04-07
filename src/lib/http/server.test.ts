import { faker } from '@faker-js/faker';
import { FastifyReply, FastifyRequest } from 'fastify';
import { MockedFunction } from 'vitest';

import { BaseHttpClient } from '../../test/helpers/base-http-client.js';
import { setupServerAndModify } from '../../test/helpers/fastify-helper.js';
import context from '../lib/context';

// More tests exists under the test folder in here
describe('server', () => {
  it('in HTTP route current context should path, method and request id', async () => {
    const route = `/${faker.datatype.uuid()}`;
    const routeCalledWithContext = vi.fn<[{ context?: any; requestId: string }], void>();

    const client = await setupServerAndModify((fastify) => {
      fastify.get(route, (req, reply) => {
        routeCalledWithContext({
          requestId: req.id,
          context: context.getAll(),
        });
        reply.send({});
      });
    });

    await client.axios.get(route);

    expect(routeCalledWithContext).toHaveBeenCalledTimes(1);

    // Get the request from the call
    const [{ requestId }] = routeCalledWithContext.mock.lastCall!;
    expect(routeCalledWithContext).toHaveBeenCalledWith({
      requestId,
      context: expect.objectContaining({
        path: route,
        method: 'GET',
        request_id: requestId,
      }),
    });
  });
});